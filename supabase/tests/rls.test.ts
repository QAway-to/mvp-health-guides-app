/**
 * Интеграционные тесты прав доступа.
 *
 * Это единственное место, где проверяется, что платный контент действительно
 * закрыт. Всё остальное — клиентские экраны, которые можно обойти прямым
 * запросом к API, поэтому здесь мы ходим ровно так: клиентом с anon-ключом,
 * мимо приложения.
 *
 * Запуск:
 *   npx supabase start
 *   npx supabase db reset          # миграции + seed.sql
 *   npm run test:rls
 */

import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL ?? 'http://127.0.0.1:54321';
const ANON_KEY = process.env.SUPABASE_ANON_KEY ?? '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!ANON_KEY || !SERVICE_KEY) {
  throw new Error(
    'Нужны SUPABASE_ANON_KEY и SUPABASE_SERVICE_ROLE_KEY. Возьмите их из вывода `npx supabase status`.',
  );
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function anonClient(): SupabaseClient {
  return createClient(SUPABASE_URL, ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Клиент со свежей анонимной сессией и его user_id. */
async function signedIn(): Promise<{ client: SupabaseClient; userId: string }> {
  const client = anonClient();
  const { data, error } = await client.auth.signInAnonymously();
  assert.equal(error, null, `анонимный вход: ${error?.message}`);
  assert.ok(data.user, 'анонимный вход не вернул пользователя');
  return { client, userId: data.user.id };
}

async function grantPremium(userId: string, expiresAt: string | null): Promise<void> {
  const { error } = await admin.from('entitlements').upsert({
    user_id: userId,
    product_id: 'fz_premium_monthly',
    status: 'active',
    store: 'app_store',
    expires_at: expiresAt,
  });
  assert.equal(error, null, `выдача премиума: ${error?.message}`);
}

const createdUsers: string[] = [];

async function newUser(): Promise<{ client: SupabaseClient; userId: string }> {
  const session = await signedIn();
  createdUsers.push(session.userId);
  return session;
}

after(async () => {
  for (const id of createdUsers) {
    await admin.auth.admin.deleteUser(id).catch(() => {});
  }
});

describe('контент', () => {
  test('карточки всех гайдов видны без подписки — это витрина', async () => {
    const { client } = await newUser();

    const { data, error } = await client.from('guides').select('slug, tier');
    assert.equal(error, null, error?.message);
    assert.ok(
      data?.some((row) => row.tier === 'premium'),
      'платные гайды должны быть видны в списке, иначе подписку нечем продавать',
    );
  });

  test('без подписки шаги бесплатного гайда читаются', async () => {
    const { client } = await newUser();

    const { data: free } = await admin
      .from('guides')
      .select('id')
      .eq('tier', 'free')
      .limit(1)
      .single();
    assert.ok(free);

    const { data } = await client.from('guide_steps').select('title').eq('guide_id', free.id);
    assert.ok((data?.length ?? 0) >= 3, 'бесплатный гайд должен открываться целиком');
  });

  test('без подписки не видны шаги платного гайда', async () => {
    const { client } = await newUser();

    const { data: premium } = await admin
      .from('guides')
      .select('id, slug')
      .eq('tier', 'premium')
      .limit(1)
      .single();
    assert.ok(premium, 'в базе должен быть хотя бы один premium-гайд');

    const { data, error } = await client
      .from('guide_steps')
      .select('title')
      .eq('guide_id', premium.id);

    assert.equal(error, null, error?.message);
    assert.deepEqual(data, [], 'тексты платных шагов не должны уходить клиенту');
  });

  test('с активной подпиской шаги платного гайда открываются', async () => {
    const { client, userId } = await newUser();
    await grantPremium(userId, null);

    const { data: premium } = await admin
      .from('guides')
      .select('id')
      .eq('tier', 'premium')
      .limit(1)
      .single();
    assert.ok(premium);

    const { data, error } = await client.from('guide_steps').select('title').eq('guide_id', premium.id);
    assert.equal(error, null, error?.message);
    assert.ok((data?.length ?? 0) > 0, 'подписчику должны приходить шаги платного гайда');
  });

  test('истёкшая подписка снова закрывает шаги', async () => {
    const { client, userId } = await newUser();
    await grantPremium(userId, new Date(Date.now() - 60_000).toISOString());

    const { data: premium } = await admin
      .from('guides')
      .select('id')
      .eq('tier', 'premium')
      .limit(1)
      .single();
    assert.ok(premium);

    const { data } = await client.from('guide_steps').select('title').eq('guide_id', premium.id);
    assert.deepEqual(data, []);
  });

  test('отключённое автопродление доступ НЕ закрывает', async () => {
    const { client, userId } = await newUser();
    await grantPremium(userId, new Date(Date.now() + 86_400_000).toISOString());
    await admin.from('entitlements').update({ auto_renew: false }).eq('user_id', userId);

    const { data: premium } = await admin
      .from('guides')
      .select('id')
      .eq('tier', 'premium')
      .limit(1)
      .single();
    assert.ok(premium);

    const { data } = await client.from('guide_steps').select('title').eq('guide_id', premium.id);
    assert.ok(
      (data?.length ?? 0) > 0,
      'период оплачен до конца — отмена автопродления не должна отрубать доступ',
    );
  });

  test('истёкшая по статусу подписка закрывает шаги', async () => {
    const { client, userId } = await newUser();
    await grantPremium(userId, null);
    await admin.from('entitlements').update({ status: 'expired' }).eq('user_id', userId);

    const { data: premium } = await admin
      .from('guides')
      .select('id')
      .eq('tier', 'premium')
      .limit(1)
      .single();
    assert.ok(premium);

    const { data } = await client.from('guide_steps').select('title').eq('guide_id', premium.id);
    assert.deepEqual(data, []);
  });

  test('оглавление и расписание программы открыты без подписки', async () => {
    const { client } = await newUser();

    const { data: categories } = await client.from('categories').select('slug');
    assert.equal(categories?.length, 8);

    const { data: program } = await client.from('program_days').select('week, day');
    assert.equal(program?.length, 28);
  });
});

describe('подписка', () => {
  test('клиент не может выписать премиум себе', async () => {
    const { client, userId } = await newUser();

    const { error } = await client.from('entitlements').insert({
      user_id: userId,
      product_id: 'fz_premium_monthly',
      status: 'active',
      store: 'promo',
    });

    assert.ok(error, 'вставка в entitlements с anon-ключа должна отклоняться');
  });

  test('клиент не может продлить чужую или свою подписку', async () => {
    const { client, userId } = await newUser();
    await grantPremium(userId, new Date(Date.now() - 60_000).toISOString());

    const { error, data } = await client
      .from('entitlements')
      .update({ expires_at: new Date(Date.now() + 86_400_000).toISOString() })
      .eq('user_id', userId)
      .select();

    // Политики update нет: PostgREST вернёт либо ошибку, либо пустой результат.
    assert.ok(error !== null || (data?.length ?? 0) === 0, 'обновление не должно проходить');

    const { data: after } = await admin
      .from('entitlements')
      .select('expires_at')
      .eq('user_id', userId)
      .single();
    assert.ok(
      after && new Date(after.expires_at as string).getTime() < Date.now(),
      'срок подписки не должен был измениться',
    );
  });

  test('свою строку подписки видно, чужую — нет', async () => {
    const owner = await newUser();
    const stranger = await newUser();
    await grantPremium(owner.userId, null);

    const { data: own } = await owner.client.from('entitlements').select('status');
    assert.equal(own?.length, 1);

    const { data: foreign } = await stranger.client
      .from('entitlements')
      .select('status')
      .eq('user_id', owner.userId);
    assert.deepEqual(foreign, []);
  });
});

describe('прогресс', () => {
  test('свой прогресс пишется и читается', async () => {
    const { client, userId } = await newUser();
    const { data: guide } = await admin
      .from('guides')
      .select('id')
      .eq('tier', 'free')
      .limit(1)
      .single();
    assert.ok(guide);

    const { error } = await client.from('progress').insert({
      user_id: userId,
      guide_id: guide.id,
      status: 'completed',
      completed_steps: [0, 1, 2],
    });
    assert.equal(error, null, error?.message);

    const { data } = await client.from('progress').select('status, completed_steps');
    assert.equal(data?.length, 1);
    assert.equal(data?.[0]?.status, 'completed');
  });

  test('чужой прогресс не читается и не пишется', async () => {
    const owner = await newUser();
    const stranger = await newUser();
    const { data: guide } = await admin
      .from('guides')
      .select('id')
      .eq('tier', 'free')
      .limit(1)
      .single();
    assert.ok(guide);

    await owner.client
      .from('progress')
      .insert({ user_id: owner.userId, guide_id: guide.id, status: 'in_progress' });

    const { data: seen } = await stranger.client
      .from('progress')
      .select('user_id')
      .eq('user_id', owner.userId);
    assert.deepEqual(seen, []);

    const { error } = await stranger.client
      .from('progress')
      .insert({ user_id: owner.userId, guide_id: guide.id, status: 'completed' });
    assert.ok(error, 'нельзя писать прогресс за другого пользователя');
  });
});

describe('профиль и события', () => {
  test('профиль создаётся автоматически и виден только свой', async () => {
    const owner = await newUser();
    const stranger = await newUser();

    const { data: own } = await owner.client.from('profiles').select('id, bucket');
    assert.equal(own?.length, 1, 'триггер должен был создать профиль');
    assert.ok(['A', 'B'].includes(own?.[0]?.bucket as string));

    const { data: foreign } = await stranger.client
      .from('profiles')
      .select('id')
      .eq('id', owner.userId);
    assert.deepEqual(foreign, []);
  });

  test('событие пишется от своего имени, но не от чужого', async () => {
    const owner = await newUser();
    const stranger = await newUser();

    const { error: ok } = await owner.client
      .from('events')
      .insert({ user_id: owner.userId, name: 'guide_opened', payload: { slug: 'first-run-500m' } });
    assert.equal(ok, null, ok?.message);

    const { error: denied } = await stranger.client
      .from('events')
      .insert({ user_id: owner.userId, name: 'paywall_shown' });
    assert.ok(denied, 'событие от чужого имени должно отклоняться');
  });

  test('события не читаются с клиента', async () => {
    const { client, userId } = await newUser();
    await client.from('events').insert({ user_id: userId, name: 'app_open' });

    const { data } = await client.from('events').select('name');
    assert.deepEqual(data, [], 'аналитика не должна быть доступна приложению на чтение');
  });
});

describe('тренер и слоты', () => {
  let slotId = '';

  before(async () => {
    const { data: trainer } = await admin.from('trainers').select('id').limit(1).single();
    assert.ok(trainer, 'seed должен был создать тренера');

    const starts = new Date(Date.now() + 86_400_000);
    const { data: slot, error } = await admin
      .from('availability_slots')
      .insert({
        trainer_id: trainer.id,
        starts_at: starts.toISOString(),
        ends_at: new Date(starts.getTime() + 45 * 60_000).toISOString(),
      })
      .select('id')
      .single();
    assert.equal(error, null, error?.message);
    slotId = slot?.id ?? '';
  });

  after(async () => {
    if (slotId) {
      await admin.from('bookings').delete().eq('slot_id', slotId);
      await admin.from('availability_slots').delete().eq('id', slotId);
    }
  });

  test('свободные слоты видны, telegram тренера — нет', async () => {
    const { client } = await newUser();

    const { data: slots } = await client.from('availability_slots').select('id, status');
    assert.ok(slots?.some((slot) => slot.id === slotId));

    const { error } = await client.from('trainers').select('telegram_chat_id');
    assert.ok(error, 'колонка с адресатом уведомлений не должна отдаваться клиенту');
  });

  test('клиент не может забронировать слот напрямую', async () => {
    const { client, userId } = await newUser();

    const { error: bookingError } = await client
      .from('bookings')
      .insert({ user_id: userId, slot_id: slotId });
    assert.ok(bookingError, 'запись создаётся только Edge Function');

    const { error: slotError, data: updated } = await client
      .from('availability_slots')
      .update({ status: 'booked' })
      .eq('id', slotId)
      .select();
    assert.ok(
      slotError !== null || (updated?.length ?? 0) === 0,
      'слот нельзя занять запросом с клиента',
    );
  });

  test('правила расписания тренера закрыты', async () => {
    const { client } = await newUser();
    const { data } = await client.from('availability_rules').select('id');
    assert.deepEqual(data, []);
  });
});

describe('журнал вебхуков', () => {
  test('недоступен клиенту', async () => {
    const { client } = await newUser();

    const { data } = await client.from('webhook_events').select('event_id');
    assert.deepEqual(data ?? [], []);

    const { error } = await client
      .from('webhook_events')
      .insert({ event_id: 'forged', payload: {} });
    assert.ok(error, 'подделать обработанный вебхук нельзя');
  });
});
