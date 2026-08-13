/**
 * Приём вебхуков RevenueCat — единственное место, где выдаётся подписка.
 *
 * Клиент про entitlements не пишет ничего: ответ стора живёт в памяти
 * приложения, и «покупка прошла» на устройстве — это утверждение устройства, а
 * не факт. Факт приходит сюда.
 *
 * Секреты (supabase secrets set):
 *   REVENUECAT_WEBHOOK_SECRET  значение заголовка Authorization из настроек RevenueCat
 *   SUPABASE_SERVICE_ROLE_KEY  подставляется платформой
 *   ALLOW_SANDBOX_PURCHASES    «true» только для тестового проекта
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';

import { json, requireEnv, safeEqual } from '../_shared/http.ts';

type RevenueCatEvent = {
  id: string;
  type: string;
  app_user_id: string;
  original_app_user_id?: string;
  product_id?: string;
  store?: string;
  environment?: string;
  expiration_at_ms?: number | null;
  grace_period_expiration_at_ms?: number | null;
  original_transaction_id?: string | null;
};

/** Типы, после которых доступ есть. */
const GRANTING = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'UNCANCELLATION',
  'PRODUCT_CHANGE',
  'NON_RENEWING_PURCHASE',
  'TRANSFER',
]);

const STORE_MAP: Record<string, string> = {
  APP_STORE: 'app_store',
  MAC_APP_STORE: 'app_store',
  PLAY_STORE: 'play_store',
  PROMOTIONAL: 'promo',
};

function toIso(ms: number | null | undefined): string | null {
  return typeof ms === 'number' ? new Date(ms).toISOString() : null;
}

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405);
  }

  const expected = requireEnv('REVENUECAT_WEBHOOK_SECRET');
  const provided = request.headers.get('authorization') ?? '';
  if (!safeEqual(provided, expected)) {
    return json({ error: 'forbidden' }, 403);
  }

  let event: RevenueCatEvent;
  try {
    const body = await request.json();
    event = body?.event;
  } catch {
    return json({ error: 'bad json' }, 400);
  }

  if (!event?.id || !event.type || !event.app_user_id) {
    return json({ error: 'bad event' }, 400);
  }

  // Песочница не должна открывать подписку в проде: sandbox-аккаунт заводится
  // за минуту, и это был бы бесплатный вход для всех желающих.
  const allowSandbox = (Deno.env.get('ALLOW_SANDBOX_PURCHASES') ?? '').toLowerCase() === 'true';
  if (event.environment === 'SANDBOX' && !allowSandbox) {
    return json({ ok: true, ignored: 'sandbox' });
  }

  const supabase = createClient(
    requireEnv('SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false } },
  );

  // Доставка «хотя бы один раз»: один и тот же event приходит повторно, и без
  // этой вставки повтор EXPIRATION способен переиграть уже применённое
  // RENEWAL. Дубль отсекается уникальностью первичного ключа.
  const { error: dedupeError } = await supabase
    .from('webhook_events')
    .insert({ event_id: event.id, source: 'revenuecat', payload: event });

  if (dedupeError) {
    if (dedupeError.code === '23505') {
      return json({ ok: true, duplicate: true });
    }
    console.error('Не удалось записать вебхук в журнал', dedupeError);
    // 500, чтобы RevenueCat прислал событие ещё раз: потерянная покупка
    // дороже лишнего повтора.
    return json({ error: 'journal write failed' }, 500);
  }

  const userId = event.app_user_id;
  const expiresAt = toIso(event.expiration_at_ms);

  if (event.type === 'EXPIRATION') {
    const { error } = await supabase
      .from('entitlements')
      .update({ status: 'expired', auto_renew: false })
      .eq('user_id', userId);
    if (error) {
      console.error('Не удалось закрыть подписку', error);
      return json({ error: 'update failed' }, 500);
    }
    return json({ ok: true, applied: 'expired' });
  }

  if (event.type === 'CANCELLATION') {
    // Отмена в RevenueCat — это выключенное автопродление, а не потеря
    // доступа: период оплачен до конца, и обрывать его нельзя.
    const { error } = await supabase
      .from('entitlements')
      .update({ auto_renew: false })
      .eq('user_id', userId);
    if (error) {
      console.error('Не удалось отметить отмену автопродления', error);
      return json({ error: 'update failed' }, 500);
    }
    return json({ ok: true, applied: 'auto_renew_off' });
  }

  if (event.type === 'BILLING_ISSUE') {
    // Льготный период: списание ещё может пройти, доступ пока остаётся.
    const graceUntil = toIso(event.grace_period_expiration_at_ms) ?? expiresAt;
    const { error } = await supabase
      .from('entitlements')
      .update({ has_billing_issue: true, ...(graceUntil ? { expires_at: graceUntil } : {}) })
      .eq('user_id', userId);
    if (error) {
      console.error('Не удалось отметить проблему с оплатой', error);
      return json({ error: 'update failed' }, 500);
    }
    return json({ ok: true, applied: 'billing_issue' });
  }

  if (!GRANTING.has(event.type)) {
    return json({ ok: true, ignored: event.type });
  }

  const { error } = await supabase.from('entitlements').upsert(
    {
      user_id: userId,
      product_id: event.product_id ?? 'unknown',
      status: 'active',
      store: STORE_MAP[event.store ?? ''] ?? 'other',
      expires_at: expiresAt,
      auto_renew: true,
      has_billing_issue: false,
      original_transaction_id: event.original_transaction_id ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    console.error('Не удалось выдать подписку', error);
    return json({ error: 'upsert failed' }, 500);
  }

  await supabase.from('events').insert({
    user_id: userId,
    name: 'premium_granted',
    payload: { type: event.type, product_id: event.product_id, store: event.store },
  });

  return json({ ok: true, applied: 'active' });
});
