import { BAREFOOT_GUIDES } from './barefoot.ts';
import { BREATHING_GUIDES } from './breathing.ts';
import { GEAR_GUIDES } from './gear.ts';
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
];

export const GUIDES: GuideDraft[] = [
  ...START_GUIDES,
  ...BREATHING_GUIDES,
  ...GEAR_GUIDES,
  ...BAREFOOT_GUIDES,
  ...STYLE_GUIDES,
  ...HARDENING_GUIDES,
  ...LONGEVITY_GUIDES,
  ...SAFETY_GUIDES,
];

/**
 * Четырёхнедельная программа: какой гайд в какой день.
 * Первые три дня бесплатны — их видит человек без подписки.
 */
export const PROGRAM: { week: number; day: number; guideSlug: string; note?: string }[] = [
  { week: 1, day: 1, guideSlug: 'first-run-500m', note: 'Начинаем с 500 метров. Больше сегодня не нужно.' },
  { week: 1, day: 2, guideSlug: 'run-to-breathe' },
  { week: 1, day: 3, guideSlug: 'choose-shoes' },
  { week: 1, day: 4, guideSlug: 'warmup' },
  { week: 1, day: 5, guideSlug: 'choose-pace' },
  { week: 1, day: 6, guideSlug: 'why-barefoot' },
  { week: 1, day: 7, guideSlug: 'when-to-run', note: 'Итог недели: два выхода в день становятся привычкой.' },

  { week: 2, day: 1, guideSlug: 'prepare-route' },
  { week: 2, day: 2, guideSlug: 'barefoot-dew' },
  { week: 2, day: 3, guideSlug: 'breathing-progression' },
  { week: 2, day: 4, guideSlug: 'style-heel-toe' },
  { week: 2, day: 5, guideSlug: 'barefoot-pebbles' },
  { week: 2, day: 6, guideSlug: 'style-forefoot' },
  { week: 2, day: 7, guideSlug: 'side-stitch', note: 'Разбираем, что делать с болью в боку.' },

  { week: 3, day: 1, guideSlug: 'style-flat-foot' },
  { week: 3, day: 2, guideSlug: 'barefoot-water' },
  { week: 3, day: 3, guideSlug: 'max-breathing' },
  { week: 3, day: 4, guideSlug: 'style-toes' },
  { week: 3, day: 5, guideSlug: 'barefoot-sand' },
  { week: 3, day: 6, guideSlug: 'where-to-run' },
  { week: 3, day: 7, guideSlug: 'style-power-walk', note: 'Учимся завершать пробежку правильно.' },

  { week: 4, day: 1, guideSlug: 'run-before-cold' },
  { week: 4, day: 2, guideSlug: 'barefoot-snow' },
  { week: 4, day: 3, guideSlug: 'after-snow' },
  { week: 4, day: 4, guideSlug: 'run-in-rain' },
  { week: 4, day: 5, guideSlug: 'barefoot-shells' },
  { week: 4, day: 6, guideSlug: 'two-kinds-of-running' },
  { week: 4, day: 7, guideSlug: 'daily-norm', note: 'Курс закончился — норма остаётся с вами.' },
];

export type { CategoryDraft, GuideDraft } from './types.ts';
