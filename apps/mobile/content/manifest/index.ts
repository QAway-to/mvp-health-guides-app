import { BAREFOOT_GUIDES } from './barefoot.ts';
import { BREATHING_GUIDES } from './breathing.ts';
import { GEAR_GUIDES } from './gear.ts';
import { ASSEMBLY_GUIDES, HABIT_GUIDES, LOAD_GUIDES, WINTER_GUIDES } from './habit.ts';
import { HARDENING_GUIDES, LONGEVITY_GUIDES, SAFETY_GUIDES } from './practice.ts';
import { START_GUIDES } from './start.ts';
import { STYLE_GUIDES } from './styles.ts';
import type { CategoryDraft, GuideDraft } from './types.ts';

export const CATEGORIES: CategoryDraft[] = [
  { slug: 'start', title: 'Начало', subtitle: 'Первая пробежка и базовые правила' },
  { slug: 'breathing', title: 'Дыхание', subtitle: 'Ради чего мы вообще бежим' },
  { slug: 'gear', title: 'Экипировка и трасса', subtitle: 'Обувь, поверхность, маршрут' },
  { slug: 'barefoot', title: 'Бег босиком', subtitle: 'Роса, снег, песок, вода' },
  { slug: 'styles', title: 'Виды бега', subtitle: 'Пять стилей и когда какой' },
  { slug: 'hardening', title: 'Закаливание', subtitle: 'Холод и терморегуляция' },
  { slug: 'longevity', title: 'Долголетие', subtitle: 'Норма, которая накапливает здоровье' },
  { slug: 'safety', title: 'Безопасность', subtitle: 'Травмы и противопоказания' },
  { slug: 'habit', title: 'Привычка', subtitle: 'Порог, срывы и возвращение' },
];

export const GUIDES: GuideDraft[] = [
  ...START_GUIDES,
  ...BREATHING_GUIDES,
  ...GEAR_GUIDES,
  ...BAREFOOT_GUIDES,
  ...STYLE_GUIDES,
  ...ASSEMBLY_GUIDES,
  ...HARDENING_GUIDES,
  ...WINTER_GUIDES,
  ...LONGEVITY_GUIDES,
  ...SAFETY_GUIDES,
  ...LOAD_GUIDES,
  ...HABIT_GUIDES,
];

/**
 * Четырёхнедельная программа: какой гайд в какой день.
 * Первые три дня бесплатны — их видит человек без подписки.
 *
 * Порядок повторяет методичку: сначала понимание и трасса, потом стопа, потом
 * дыхание и режим, и только в последнюю неделю техника и сборка. Перескочить
 * вперёд — значит повторить ту травму, из-за которой люди бросают бег, поэтому
 * техники стоят последними, а не первыми.
 *
 * Каждая неделя заканчивается не новой нагрузкой, а разбором того, обо что
 * спотыкаются именно на этом сроке: объём, отдых, порог выхода.
 */
export const PROGRAM: { week: number; day: number; guideSlug: string; note?: string }[] = [
  // Неделя 1 — почему болит, где бежать, первый выход
  { week: 1, day: 1, guideSlug: 'why-barefoot', note: 'Сначала причина, потом километры.' },
  { week: 1, day: 2, guideSlug: 'when-not-to-run' },
  { week: 1, day: 3, guideSlug: 'prepare-route' },
  { week: 1, day: 4, guideSlug: 'choose-shoes' },
  { week: 1, day: 5, guideSlug: 'first-run-500m', note: 'Ровно 500 метров. Больше сегодня не нужно.' },
  { week: 1, day: 6, guideSlug: 'warmup' },
  { week: 1, day: 7, guideSlug: 'first-week', note: 'Итог недели: семь дней подряд важнее длины пробежки.' },

  // Неделя 2 — пробуждение стопы
  { week: 2, day: 1, guideSlug: 'barefoot-dew' },
  { week: 2, day: 2, guideSlug: 'barefoot-pebbles' },
  { week: 2, day: 3, guideSlug: 'barefoot-shells' },
  { week: 2, day: 4, guideSlug: 'barefoot-water' },
  { week: 2, day: 5, guideSlug: 'barefoot-sand' },
  { week: 2, day: 6, guideSlug: 'where-to-run' },
  { week: 2, day: 7, guideSlug: 'progression-and-volume', note: 'Итог недели: добавляем понемногу, а не рывком.' },

  // Неделя 3 — дыхание, режим и отдых
  { week: 3, day: 1, guideSlug: 'run-to-breathe' },
  { week: 3, day: 2, guideSlug: 'breathing-progression' },
  { week: 3, day: 3, guideSlug: 'max-breathing' },
  { week: 3, day: 4, guideSlug: 'side-stitch' },
  { week: 3, day: 5, guideSlug: 'when-to-run' },
  { week: 3, day: 6, guideSlug: 'daily-norm' },
  { week: 3, day: 7, guideSlug: 'sleep-and-recovery', note: 'Итог недели: отдых — часть практики, а не пауза в ней.' },

  // Неделя 4 — техника и то, что держит привычку
  { week: 4, day: 1, guideSlug: 'style-flat-foot' },
  { week: 4, day: 2, guideSlug: 'style-forefoot' },
  { week: 4, day: 3, guideSlug: 'style-toes' },
  { week: 4, day: 4, guideSlug: 'style-heel-toe' },
  { week: 4, day: 5, guideSlug: 'style-power-walk' },
  { week: 4, day: 6, guideSlug: 'one-run-assembly', note: 'Собираем всё в одну пробежку от начала до конца.' },
  { week: 4, day: 7, guideSlug: 'motivation-threshold', note: 'Курс закончился. Дальше всё решает порог у двери.' },
];

export type { CategoryDraft, GuideDraft } from './types.ts';
