/**
 * Запись к тренеру.
 *
 * Слот занимается одним UPDATE с условием на текущий статус. С клиента это
 * было бы две операции — «проверил, что свободен» и «занял», — а между ними
 * успевает вклиниться второй человек, и оба видят подтверждение на одно время.
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';

import { json, requireEnv } from '../_shared/http.ts';
import { notifyTelegram } from '../_shared/telegram.ts';

type BookRequest = {
  slotId?: string;
  topic?: string;
  contact?: string;
};

const MAX_TOPIC = 500;
const MAX_CONTACT = 200;

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') {
    return json({ error: 'method not allowed' }, 405);
  }

  const authHeader = request.headers.get('authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) {
    return json({ error: 'unauthorized' }, 401);
  }

  const url = requireEnv('SUPABASE_URL');
  const anonKey = requireEnv('SUPABASE_ANON_KEY');
  const serviceKey = requireEnv('SUPABASE_SERVICE_ROLE_KEY');

  // Кто просит — определяем его же токеном, а не тем, что пришло в теле.
  const asUser = createClient(url, anonKey, {
    global: { headers: { authorization: authHeader } },
    auth: { persistSession: false },
  });

  const { data: auth } = await asUser.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) {
    return json({ error: 'unauthorized' }, 401);
  }

  let body: BookRequest;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'bad json' }, 400);
  }

  const slotId = body.slotId?.trim();
  if (!slotId) {
    return json({ error: 'slotId required' }, 400);
  }

  const topic = (body.topic ?? '').trim().slice(0, MAX_TOPIC);
  const contact = (body.contact ?? '').trim().slice(0, MAX_CONTACT);

  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  // Запись к тренеру входит в подписку — проверяем на сервере, а не по флагу
  // из приложения.
  const { data: entitlement } = await admin
    .from('entitlements')
    .select('status, expires_at')
    .eq('user_id', userId)
    .maybeSingle();

  const hasPremium =
    entitlement?.status === 'active' &&
    (entitlement.expires_at === null || new Date(entitlement.expires_at).getTime() > Date.now());

  if (!hasPremium) {
    return json({ error: 'subscription required' }, 402);
  }

  const { data: slot } = await admin
    .from('availability_slots')
    .select('id, trainer_id, starts_at, ends_at, status')
    .eq('id', slotId)
    .maybeSingle();

  if (!slot) {
    return json({ error: 'slot not found' }, 404);
  }
  if (new Date(slot.starts_at).getTime() <= Date.now()) {
    return json({ error: 'slot in the past' }, 409);
  }

  // Атомарный захват: пустой результат означает, что слот забрали раньше нас.
  const { data: claimed, error: claimError } = await admin
    .from('availability_slots')
    .update({ status: 'booked' })
    .eq('id', slotId)
    .eq('status', 'open')
    .select('id');

  if (claimError) {
    console.error('Не удалось занять слот', claimError);
    return json({ error: 'claim failed' }, 500);
  }
  if (!claimed || claimed.length === 0) {
    return json({ error: 'slot already taken' }, 409);
  }

  const { data: booking, error: bookingError } = await admin
    .from('bookings')
    .insert({ user_id: userId, slot_id: slotId, topic, contact })
    .select('id, created_at')
    .single();

  if (bookingError || !booking) {
    // Слот уже помечен занятым — если запись не создалась, его нужно вернуть,
    // иначе время пропадёт из расписания навсегда.
    await admin.from('availability_slots').update({ status: 'open' }).eq('id', slotId);
    console.error('Не удалось создать запись', bookingError);
    return json({ error: 'booking failed' }, 500);
  }

  await admin.from('events').insert({
    user_id: userId,
    name: 'booking_created',
    payload: { slot_id: slotId, starts_at: slot.starts_at },
  });

  const { data: trainer } = await admin
    .from('trainers')
    .select('telegram_chat_id')
    .eq('id', slot.trainer_id)
    .maybeSingle();

  if (trainer?.telegram_chat_id) {
    const when = new Date(slot.starts_at).toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' });
    await notifyTelegram(
      trainer.telegram_chat_id,
      `📅 <b>Новая запись</b>\n${when} (МСК)\n` +
        (topic ? `Запрос: ${topic}\n` : '') +
        (contact ? `Связь: ${contact}` : ''),
    );
  }

  return json({ ok: true, bookingId: booking.id, startsAt: slot.starts_at }, 201);
});
