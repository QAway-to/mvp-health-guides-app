/**
 * Сборка content/guides.json из редакторского манифеста.
 *
 * Смысл шага сборки — не преобразование, а проверка. Каждый шаг гайда обязан
 * ссылаться на существующий раздел `content/source/persona.txt`: это
 * единственный механизм, который не даёт дописать в приложение факт, которого
 * нет в базе знаний Федерации. Бот держит то же правило промптом; здесь ИИ нет,
 * поэтому правило держит сборка.
 *
 * Запуск: npm run build:guides
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CATEGORIES, GUIDES, PROGRAM } from '../content/manifest/index.ts';
import type { GuideDraft } from '../content/manifest/types.ts';
import { tagsForText, type Tag } from '../content/taxonomy.ts';

const CONTENT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'content');
const SOURCE_PATH = join(CONTENT_DIR, 'source', 'persona.txt');
const OUTPUT_PATH = join(CONTENT_DIR, 'guides.json');

/** Заголовок раздела базы знаний: строка целиком в верхнем регистре. */
const HEADING_RE = /^[А-ЯЁ][А-ЯЁ0-9 ,()/«»—–-]*:?$/;

export type BuiltStep = {
  orderIndex: number;
  title: string;
  body: string;
  durationSec: number | null;
  checklist: string[];
  source: string;
};

export type BuiltGuide = {
  slug: string;
  categorySlug: string;
  title: string;
  summary: string;
  tier: 'free' | 'premium';
  level: 'beginner' | 'regular';
  durationMin: number;
  tags: Tag[];
  contraindications: string | null;
  orderIndex: number;
  steps: BuiltStep[];
};

export type BuiltContent = {
  generatedAt: string;
  categories: { slug: string; title: string; subtitle: string; orderIndex: number }[];
  guides: BuiltGuide[];
  program: { week: number; day: number; guideSlug: string; note: string | null }[];
};

/** Разобрать базу знаний на разделы: заголовок -> текст под ним. */
export function parseSections(raw: string): Map<string, string> {
  const sections = new Map<string, string>();
  let current: string | null = null;
  let buffer: string[] = [];

  const flush = () => {
    if (current) {
      sections.set(current, buffer.join('\n').trim());
    }
  };

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && HEADING_RE.test(trimmed) && trimmed.length > 3) {
      flush();
      current = trimmed.replace(/:$/, '');
      buffer = [];
      continue;
    }
    if (current) {
      buffer.push(line);
    }
  }
  flush();

  return sections;
}

/**
 * Теги гайда: выведенные из заголовка, описания и шагов плюс заданные вручную.
 * Гайд без тегов не находится поиском — сборка такое не пропускает.
 */
function tagsForGuide(guide: GuideDraft): Tag[] {
  const haystack = [
    guide.title,
    guide.summary,
    ...guide.steps.flatMap((step) => [step.title, step.body]),
  ].join(' ');

  return [...new Set([...tagsForText(haystack), ...(guide.extraTags ?? [])])].sort();
}

function validate(guides: GuideDraft[], sections: Map<string, string>): string[] {
  const problems: string[] = [];
  const categorySlugs = new Set(CATEGORIES.map((c) => c.slug));
  const seenSlugs = new Set<string>();
  const guideSlugs = new Set(guides.map((g) => g.slug));

  for (const guide of guides) {
    const where = `гайд «${guide.slug}»`;

    if (seenSlugs.has(guide.slug)) {
      problems.push(`${where}: slug повторяется`);
    }
    seenSlugs.add(guide.slug);

    if (!categorySlugs.has(guide.categorySlug)) {
      problems.push(`${where}: неизвестная категория «${guide.categorySlug}»`);
    }
    if (guide.steps.length < 3) {
      problems.push(`${where}: ${guide.steps.length} шага — минимум 3`);
    }
    if (tagsForGuide(guide).length === 0) {
      problems.push(`${where}: не распознан ни один тег, гайд не найдётся поиском`);
    }

    for (const [index, step] of guide.steps.entries()) {
      if (!sections.has(step.source)) {
        problems.push(
          `${where}, шаг ${index + 1}: раздела «${step.source}» нет в persona.txt`,
        );
      }
      if (!step.body.trim()) {
        problems.push(`${where}, шаг ${index + 1}: пустой текст`);
      }
    }
  }

  if (!guides.some((g) => g.tier === 'free')) {
    problems.push('нет ни одного бесплатного гайда — пейволл закроет вообще всё');
  }

  for (const day of PROGRAM) {
    if (!guideSlugs.has(day.guideSlug)) {
      problems.push(`программа, неделя ${day.week} день ${day.day}: нет гайда «${day.guideSlug}»`);
    }
  }

  return problems;
}

export function build(raw: string): BuiltContent {
  const sections = parseSections(raw);
  const problems = validate(GUIDES, sections);

  if (problems.length > 0) {
    throw new Error(`Манифест не прошёл проверку:\n  — ${problems.join('\n  — ')}`);
  }

  const perCategoryIndex = new Map<string, number>();

  return {
    generatedAt: new Date().toISOString(),
    categories: CATEGORIES.map((category, index) => ({ ...category, orderIndex: index })),
    guides: GUIDES.map((guide) => {
      const index = perCategoryIndex.get(guide.categorySlug) ?? 0;
      perCategoryIndex.set(guide.categorySlug, index + 1);

      return {
        slug: guide.slug,
        categorySlug: guide.categorySlug,
        title: guide.title,
        summary: guide.summary,
        tier: guide.tier,
        level: guide.level,
        durationMin: guide.durationMin,
        tags: tagsForGuide(guide),
        contraindications: guide.contraindications ?? null,
        orderIndex: index,
        steps: guide.steps.map((step, stepIndex) => ({
          orderIndex: stepIndex,
          title: step.title,
          body: step.body,
          durationSec: step.durationSec ?? null,
          checklist: step.checklist ?? [],
          source: step.source,
        })),
      };
    }),
    program: PROGRAM.map((day) => ({ ...day, note: day.note ?? null })),
  };
}

function main(): void {
  const raw = readFileSync(SOURCE_PATH, 'utf-8');
  const content = build(raw);

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(content, null, 2)}\n`, 'utf-8');

  const free = content.guides.filter((g) => g.tier === 'free').length;
  const steps = content.guides.reduce((sum, g) => sum + g.steps.length, 0);
  console.log(
    `guides.json собран: ${content.guides.length} гайдов (${free} бесплатных), ` +
      `${steps} шагов, ${content.categories.length} категорий, ${content.program.length} дней программы`,
  );
}

if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  main();
}
