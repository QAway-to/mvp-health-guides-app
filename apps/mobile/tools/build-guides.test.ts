import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

import { tagsForText } from '../content/taxonomy.ts';
import { build, parseSections } from './build-guides.ts';

const SOURCE = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', 'content', 'source', 'persona.txt'),
  'utf-8',
);

const sections = parseSections(SOURCE);
const content = build(SOURCE);

test('база знаний разбирается на разделы', () => {
  assert.ok(sections.has('БЕГ БОСИКОМ'));
  assert.ok(sections.has('ВИДЫ БЕГА'));
  assert.ok(sections.has('ОТВЕТЫ НА ЧАСТЫЕ ВОПРОСЫ'));
  assert.ok(sections.get('ВЫБОР КРОССОВОК')?.includes('гибкой'));
});

test('гайдов достаточно и у каждого не меньше трёх шагов', () => {
  assert.ok(content.guides.length >= 20, `гайдов всего ${content.guides.length}`);
  for (const guide of content.guides) {
    assert.ok(guide.steps.length >= 3, `${guide.slug}: ${guide.steps.length} шага`);
  }
});

test('каждый шаг прослеживается до раздела базы знаний', () => {
  for (const guide of content.guides) {
    for (const step of guide.steps) {
      assert.ok(
        sections.has(step.source),
        `${guide.slug}/${step.title}: нет раздела «${step.source}»`,
      );
    }
  }
});

test('ни один гайд не остался без тегов', () => {
  // Гайд без тегов не находится поиском — в боте эту дыру закрывает
  // ContentLibrary.untagged(), здесь её закрывает тест.
  const untagged = content.guides.filter((guide) => guide.tags.length === 0);
  assert.deepEqual(untagged.map((g) => g.slug), []);
});

test('бесплатной части хватает на полную первую тренировку', () => {
  const free = content.guides.filter((guide) => guide.tier === 'free');
  assert.ok(free.length >= 6, `бесплатных гайдов всего ${free.length}`);

  const firstRun = free.find((guide) => guide.slug === 'first-run-500m');
  assert.ok(firstRun !== undefined, 'первая пробежка должна быть бесплатной');
  assert.ok(firstRun.steps.length >= 5, 'первая тренировка должна быть проведена целиком');
});

test('программа ссылается только на существующие гайды', () => {
  const slugs = new Set(content.guides.map((guide) => guide.slug));
  for (const day of content.program) {
    assert.ok(slugs.has(day.guideSlug), `неделя ${day.week} день ${day.day}: ${day.guideSlug}`);
  }
  assert.equal(content.program.length, 28, 'программа рассчитана на 4 недели');
});

test('первые три дня программы бесплатны', () => {
  const tiers = new Map(content.guides.map((guide) => [guide.slug, guide.tier]));
  const firstThree = content.program
    .filter((day) => day.week === 1 && day.day <= 3)
    .map((day) => tiers.get(day.guideSlug));

  assert.deepEqual(firstThree, ['free', 'free', 'free']);
});

test('слаги уникальны', () => {
  const slugs = content.guides.map((guide) => guide.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test('синоним ищется с начала слова, а не подстрокой', () => {
  // «море» сидит внутри «терМОРЕгуляции»: без границы слова любое упоминание
  // терморегуляции притягивало бы пляж и воду.
  const tags = tagsForText('тренировка терморегуляции');
  assert.ok(tags.includes('закаливание'));
  assert.ok(!tags.includes('пляж'), 'терморегуляция не должна давать тег «пляж»');
  assert.ok(!tags.includes('вода'), 'терморегуляция не должна давать тег «вода»');
});

test('таксономия узнаёт живые формулировки', () => {
  assert.ok(tagsForText('как бегать по снегу зимой').includes('снег'));
  assert.ok(tagsForText('какие кроссовки выбрать').includes('обувь'));
  assert.ok(tagsForText('колет в боку, сбилось дыхание').includes('дыхание'));
  assert.deepEqual(tagsForText(''), []);
});
