/**
 * Генерация supabase/seed.sql из content/guides.json.
 *
 * Seed идемпотентен: его можно прогнать по живой базе после правки текстов, и
 * он обновит контент, не тронув прогресс и покупки. Шаги переписываются
 * целиком — порядок и состав шагов меняются вместе, и точечный upsert
 * оставлял бы хвосты от удалённых шагов.
 *
 * Запуск: npm run build:seed (после build:guides)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import type { BuiltContent } from './build-guides.ts';

const HERE = dirname(fileURLToPath(import.meta.url));
const GUIDES_PATH = join(HERE, '..', 'content', 'guides.json');
const SEED_PATH = join(HERE, '..', '..', '..', 'supabase', 'seed.sql');

/** Литерал строки для SQL. Одинарные кавычки удваиваются, null остаётся null. */
function lit(value: string | null): string {
  if (value === null) {
    return 'null';
  }
  return `'${value.replace(/'/g, "''")}'`;
}

function textArray(values: string[]): string {
  if (values.length === 0) {
    return `'{}'::text[]`;
  }
  return `array[${values.map(lit).join(', ')}]::text[]`;
}

function jsonbArray(values: string[]): string {
  return `${lit(JSON.stringify(values))}::jsonb`;
}

function render(content: BuiltContent): string {
  const out: string[] = [
    '-- Сгенерировано `npm run build:seed` из content/guides.json.',
    '-- Править здесь нечего: правьте манифест в apps/mobile/content/manifest.',
    '',
    'begin;',
    '',
    '-- Категории -----------------------------------------------------------',
  ];

  for (const category of content.categories) {
    out.push(
      'insert into public.categories (slug, title, subtitle, order_index) values (' +
        `${lit(category.slug)}, ${lit(category.title)}, ${lit(category.subtitle)}, ${category.orderIndex})`,
      '  on conflict (slug) do update set',
      '    title = excluded.title, subtitle = excluded.subtitle, order_index = excluded.order_index;',
    );
  }

  out.push('', '-- Гайды ---------------------------------------------------------------');

  for (const guide of content.guides) {
    out.push(
      'insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)',
      `select ${lit(guide.slug)}, c.id, ${lit(guide.title)}, ${lit(guide.summary)}, ${lit(guide.tier)}, ${lit(guide.level)},`,
      `       ${guide.durationMin}, ${textArray(guide.tags)}, ${lit(guide.contraindications)}, ${guide.orderIndex}, true`,
      `  from public.categories c where c.slug = ${lit(guide.categorySlug)}`,
      '  on conflict (slug) do update set',
      '    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,',
      '    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,',
      '    tags = excluded.tags, contraindications = excluded.contraindications,',
      '    order_index = excluded.order_index, published = excluded.published;',
    );
  }

  out.push(
    '',
    '-- Шаги ----------------------------------------------------------------',
    '-- Переписываются целиком: состав и порядок шагов меняются вместе.',
    'delete from public.guide_steps;',
  );

  for (const guide of content.guides) {
    for (const step of guide.steps) {
      out.push(
        'insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)',
        `select g.id, ${step.orderIndex}, ${lit(step.title)}, ${lit(step.body)}, ${step.durationSec ?? 'null'},`,
        `       ${jsonbArray(step.checklist)}, ${lit(step.source)}`,
        `  from public.guides g where g.slug = ${lit(guide.slug)};`,
      );
    }
  }

  out.push('', '-- Программа -----------------------------------------------------------');

  for (const day of content.program) {
    out.push(
      'insert into public.program_days (week, day, guide_id, note)',
      `select ${day.week}, ${day.day}, g.id, ${lit(day.note)}`,
      `  from public.guides g where g.slug = ${lit(day.guideSlug)}`,
      '  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;',
    );
  }

  out.push(
    '',
    '-- Тренер ---------------------------------------------------------------',
    '-- Демонстрационная запись: имя и расписание заменяются реальными до',
    '-- живого трафика. Telegram-адресат задаётся отдельно, не из seed.',
    "insert into public.trainers (name, bio, timezone)",
    "select 'Богдан', 'Глава Федерации Здоровья. Разбирает технику бега и закаливание.', 'Europe/Moscow'",
    '  where not exists (select 1 from public.trainers);',
    '',
    'commit;',
    '',
  );

  return out.join('\n');
}

function main(): void {
  const content = JSON.parse(readFileSync(GUIDES_PATH, 'utf-8')) as BuiltContent;
  const sql = render(content);
  writeFileSync(SEED_PATH, sql, 'utf-8');

  const steps = content.guides.reduce((sum, guide) => sum + guide.steps.length, 0);
  console.log(
    `seed.sql собран: ${content.categories.length} категорий, ${content.guides.length} гайдов, ` +
      `${steps} шагов, ${content.program.length} дней программы`,
  );
}

main();
