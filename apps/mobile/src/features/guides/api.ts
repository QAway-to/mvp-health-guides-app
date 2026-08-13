import { supabase } from '@/lib/supabase';
import type {
  Category,
  Guide,
  GuideStep,
  GuideWithSteps,
  ProgramDay,
  ProgressRecord,
} from './types';

const GUIDE_COLUMNS =
  'id, slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index';

function fail(context: string, message: string): never {
  throw new Error(`${context}: ${message}`);
}

export async function fetchCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, slug, title, subtitle, order_index')
    .order('order_index')
    .returns<Category[]>();

  if (error) {
    fail('Не удалось загрузить категории', error.message);
  }
  return data ?? [];
}

/**
 * Гайды, доступные текущему пользователю. Платные приходят только при активной
 * подписке — фильтрует RLS, а не этот запрос: проверка на клиенте не помешала
 * бы прочитать тексты прямо из ответа API.
 */
export async function fetchGuides(): Promise<Guide[]> {
  const { data, error } = await supabase
    .from('guides')
    .select(GUIDE_COLUMNS)
    .order('order_index')
    .returns<Guide[]>();

  if (error) {
    fail('Не удалось загрузить гайды', error.message);
  }
  return data ?? [];
}

/**
 * Гайд вместе с шагами. Возвращает null, когда гайд платный, а подписки нет:
 * для RLS такой строки просто не существует, и это не ошибка, а пейволл.
 */
export async function fetchGuide(slug: string): Promise<GuideWithSteps | null> {
  const { data, error } = await supabase
    .from('guides')
    .select(`${GUIDE_COLUMNS}, steps:guide_steps (id, order_index, title, body, duration_sec, checklist)`)
    .eq('slug', slug)
    .maybeSingle<Guide & { steps: GuideStep[] }>();

  if (error) {
    fail('Не удалось загрузить гайд', error.message);
  }
  if (!data) {
    return null;
  }

  return {
    ...data,
    steps: [...data.steps].sort((a, b) => a.order_index - b.order_index),
  };
}

export async function fetchProgram(): Promise<ProgramDay[]> {
  const { data, error } = await supabase
    .from('program_days')
    .select('week, day, guide_id, note')
    .order('week')
    .order('day')
    .returns<ProgramDay[]>();

  if (error) {
    fail('Не удалось загрузить программу', error.message);
  }
  return data ?? [];
}

export async function fetchProgress(): Promise<ProgressRecord[]> {
  const { data, error } = await supabase
    .from('progress')
    .select('guide_id, status, completed_steps, completed_at')
    .returns<ProgressRecord[]>();

  if (error) {
    fail('Не удалось загрузить прогресс', error.message);
  }
  return data ?? [];
}

export type ProgressUpdate = {
  userId: string;
  guideId: string;
  completedSteps: number[];
  isCompleted: boolean;
};

export async function saveProgress({
  userId,
  guideId,
  completedSteps,
  isCompleted,
}: ProgressUpdate): Promise<void> {
  const { error } = await supabase.from('progress').upsert(
    {
      user_id: userId,
      guide_id: guideId,
      status: isCompleted ? 'completed' : 'in_progress',
      completed_steps: completedSteps,
      completed_at: isCompleted ? new Date().toISOString() : null,
    },
    { onConflict: 'user_id,guide_id' },
  );

  if (error) {
    fail('Не удалось сохранить прогресс', error.message);
  }
}

/** Есть ли активная подписка. Строку видно только свою — это гарантирует RLS. */
export async function fetchHasPremium(): Promise<boolean> {
  const { data, error } = await supabase
    .from('entitlements')
    .select('status, expires_at')
    .maybeSingle<{ status: string; expires_at: string | null }>();

  if (error) {
    fail('Не удалось проверить подписку', error.message);
  }
  if (!data || data.status !== 'active') {
    return false;
  }
  return data.expires_at === null || new Date(data.expires_at).getTime() > Date.now();
}

/**
 * Событие воронки. Имена совпадают с событиями бота, чтобы две воронки
 * сравнивались между собой. Аналитика никогда не должна ронять экран, поэтому
 * ошибки здесь глотаются намеренно.
 */
export async function trackEvent(
  userId: string | null,
  name: string,
  payload: Record<string, unknown> = {},
): Promise<void> {
  await supabase.from('events').insert({ user_id: userId, name, payload });
}
