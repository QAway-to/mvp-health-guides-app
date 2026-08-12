import type { Tag } from '../taxonomy.ts';

export type Tier = 'free' | 'premium';
export type Level = 'beginner' | 'regular';

/**
 * Шаг ведомой сессии.
 *
 * `source` — заголовок раздела в `content/source/persona.txt`, откуда взяты
 * факты шага. Сборка падает, если такого раздела в базе знаний нет: это
 * единственный механизм, который не даёт редактору дописать факт от себя.
 */
export type StepDraft = {
  title: string;
  body: string;
  /** Таймер шага. Без него шаг проходится по кнопке «Дальше». */
  durationSec?: number;
  checklist?: string[];
  source: string;
};

export type GuideDraft = {
  slug: string;
  categorySlug: string;
  title: string;
  summary: string;
  tier: Tier;
  level: Level;
  durationMin: number;
  /** Теги сверх выведенных из текста автоматически. */
  extraTags?: Tag[];
  contraindications?: string;
  steps: StepDraft[];
};

export type CategoryDraft = {
  slug: string;
  title: string;
  subtitle: string;
};
