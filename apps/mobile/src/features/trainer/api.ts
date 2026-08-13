import { supabase } from '@/lib/supabase';

export type Trainer = {
  id: string;
  name: string;
  bio: string;
  avatar_url: string | null;
  timezone: string;
};

export type Slot = {
  id: string;
  trainer_id: string;
  starts_at: string;
  ends_at: string;
  status: 'open' | 'booked' | 'closed';
};

export type Booking = {
  id: string;
  slot_id: string;
  status: 'confirmed' | 'cancelled';
  topic: string;
  meeting_url: string | null;
  created_at: string;
  slot: Pick<Slot, 'starts_at' | 'ends_at'> | null;
};

export async function fetchTrainer(): Promise<Trainer | null> {
  const { data, error } = await supabase
    .from('trainers')
    .select('id, name, bio, avatar_url, timezone')
    .limit(1)
    .maybeSingle<Trainer>();

  if (error) {
    throw new Error(`Не удалось загрузить тренера: ${error.message}`);
  }
  return data;
}

export async function fetchOpenSlots(): Promise<Slot[]> {
  const { data, error } = await supabase
    .from('availability_slots')
    .select('id, trainer_id, starts_at, ends_at, status')
    .eq('status', 'open')
    .gt('starts_at', new Date().toISOString())
    .order('starts_at')
    .limit(60)
    .returns<Slot[]>();

  if (error) {
    throw new Error(`Не удалось загрузить свободное время: ${error.message}`);
  }
  return data ?? [];
}

export async function fetchMyBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('id, slot_id, status, topic, meeting_url, created_at, slot:availability_slots (starts_at, ends_at)')
    .order('created_at', { ascending: false })
    .returns<Booking[]>();

  if (error) {
    throw new Error(`Не удалось загрузить записи: ${error.message}`);
  }
  return data ?? [];
}

export type BookSlotResult =
  | { ok: true; bookingId: string; startsAt: string }
  | { ok: false; reason: 'taken' | 'subscription' | 'unknown'; message: string };

/**
 * Забронировать слот.
 *
 * Идёт через Edge Function, а не через таблицу: захват слота обязан быть
 * одной операцией. Слот, который «был свободен секунду назад», — не гарантия.
 */
export async function bookSlot(input: {
  slotId: string;
  topic: string;
  contact: string;
}): Promise<BookSlotResult> {
  const { data, error } = await supabase.functions.invoke<{ bookingId: string; startsAt: string }>(
    'book-slot',
    { body: input },
  );

  if (error) {
    const status = (error as { context?: { status?: number } }).context?.status;
    if (status === 409) {
      return { ok: false, reason: 'taken', message: 'Это время только что заняли. Выберите другое.' };
    }
    if (status === 402) {
      return {
        ok: false,
        reason: 'subscription',
        message: 'Запись к тренеру входит в подписку.',
      };
    }
    return { ok: false, reason: 'unknown', message: 'Не удалось записаться. Попробуйте ещё раз.' };
  }

  if (!data) {
    return { ok: false, reason: 'unknown', message: 'Пустой ответ сервера.' };
  }
  return { ok: true, bookingId: data.bookingId, startsAt: data.startsAt };
}
