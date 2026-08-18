-- Сгенерировано `npm run build:seed` из content/guides.json.
-- Править здесь нечего: правьте манифест в apps/mobile/content/manifest.

begin;

-- Категории -----------------------------------------------------------
insert into public.categories (slug, title, subtitle, order_index) values ('start', 'Начало', 'Первая пробежка и базовые правила', 0)
  on conflict (slug) do update set
    title = excluded.title, subtitle = excluded.subtitle, order_index = excluded.order_index;
insert into public.categories (slug, title, subtitle, order_index) values ('breathing', 'Дыхание', 'Ради чего мы вообще бежим', 1)
  on conflict (slug) do update set
    title = excluded.title, subtitle = excluded.subtitle, order_index = excluded.order_index;
insert into public.categories (slug, title, subtitle, order_index) values ('gear', 'Экипировка и трасса', 'Обувь, поверхность, маршрут', 2)
  on conflict (slug) do update set
    title = excluded.title, subtitle = excluded.subtitle, order_index = excluded.order_index;
insert into public.categories (slug, title, subtitle, order_index) values ('barefoot', 'Бег босиком', 'Роса, снег, песок, вода', 3)
  on conflict (slug) do update set
    title = excluded.title, subtitle = excluded.subtitle, order_index = excluded.order_index;
insert into public.categories (slug, title, subtitle, order_index) values ('styles', 'Виды бега', 'Пять стилей и когда какой', 4)
  on conflict (slug) do update set
    title = excluded.title, subtitle = excluded.subtitle, order_index = excluded.order_index;
insert into public.categories (slug, title, subtitle, order_index) values ('hardening', 'Закаливание', 'Холод и терморегуляция', 5)
  on conflict (slug) do update set
    title = excluded.title, subtitle = excluded.subtitle, order_index = excluded.order_index;
insert into public.categories (slug, title, subtitle, order_index) values ('longevity', 'Долголетие', 'Норма, которая накапливает здоровье', 6)
  on conflict (slug) do update set
    title = excluded.title, subtitle = excluded.subtitle, order_index = excluded.order_index;
insert into public.categories (slug, title, subtitle, order_index) values ('safety', 'Безопасность', 'Травмы и противопоказания', 7)
  on conflict (slug) do update set
    title = excluded.title, subtitle = excluded.subtitle, order_index = excluded.order_index;
insert into public.categories (slug, title, subtitle, order_index) values ('habit', 'Привычка', 'Порог, срывы и возвращение', 8)
  on conflict (slug) do update set
    title = excluded.title, subtitle = excluded.subtitle, order_index = excluded.order_index;

-- Гайды ---------------------------------------------------------------
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'first-run-500m', c.id, 'Первая пробежка: 500 метров', 'Полная первая тренировка — от разминки до завершения. Дистанция ровно 500 метров.', 'free', 'beginner',
       15, array['вода', 'дыхание', 'начало', 'пляж', 'травмы']::text[], 'При острых болях в суставах и позвоночнике, после недавних операций и при обострении хронических заболеваний сначала врач — потом бег.', 0, true
  from public.categories c where c.slug = 'start'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'choose-pace', c.id, 'Как выбрать темп', 'Ориентир — не секундомер, а самочувствие. Как понять, что нагрузка ваша.', 'free', 'beginner',
       5, array['начало']::text[], null, 1, true
  from public.categories c where c.slug = 'start'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'warmup', c.id, 'Разминка перед бегом', 'Когда разминка обязательна, а когда её можно пропустить.', 'free', 'beginner',
       5, array['дыхание']::text[], null, 2, true
  from public.categories c where c.slug = 'start'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'when-to-run', c.id, 'Когда бегать: рассвет и закат', 'Два лучших времени суток и почему их два, а не одно.', 'free', 'beginner',
       4, array['роса']::text[], null, 3, true
  from public.categories c where c.slug = 'start'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'run-to-breathe', c.id, 'Бежать, чтобы дышать', 'Главная идея Федерации: задача пробежки — насытить тело кислородом, а не намотать километры.', 'free', 'beginner',
       6, array['вода', 'дыхание', 'начало', 'пляж', 'роса', 'травмы']::text[], null, 0, true
  from public.categories c where c.slug = 'breathing'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'breathing-progression', c.id, 'Прогрессия дыхания: рот → нос', 'Три стадии одной пробежки. Носовое дыхание включает терморегуляцию.', 'premium', 'regular',
       12, array['дыхание', 'закаливание', 'начало', 'техника']::text[], null, 1, true
  from public.categories c where c.slug = 'breathing'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'max-breathing', c.id, 'Максимальное дыхание на медленном бегу', 'Вдох на полную грудь и выдох с задержкой — техника, ради которой темп специально снижают.', 'premium', 'regular',
       10, array['дыхание', 'техника']::text[], null, 2, true
  from public.categories c where c.slug = 'breathing'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'side-stitch', c.id, 'Колет в боку: что делать', 'Боль в боку — сигнал нехватки кислорода. Разбираем, как её снять на ходу.', 'free', 'beginner',
       4, array['дыхание', 'травмы']::text[], null, 3, true
  from public.categories c where c.slug = 'breathing'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'choose-shoes', c.id, 'Выбор кроссовок', 'Два требования к обуви — и почему в тапочках бегать нельзя.', 'free', 'beginner',
       4, array['обувь', 'роса', 'техника', 'травмы']::text[], null, 0, true
  from public.categories c where c.slug = 'gear'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'prepare-route', c.id, 'Подготовка маршрута', 'Обязательный ритуал перед бегом босиком: пройти трассу в обуви и убрать опасное.', 'free', 'beginner',
       8, array['обувь', 'пляж', 'роса']::text[], null, 1, true
  from public.categories c where c.slug = 'gear'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'where-to-run', c.id, 'Где бегать и где нельзя', 'Лес, поле, берег моря — и почему стадион с резиновым покрытием попал в чёрный список.', 'premium', 'regular',
       6, array['вода', 'дыхание', 'пляж']::text[], null, 2, true
  from public.categories c where c.slug = 'gear'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'why-barefoot', c.id, 'Зачем бегать босиком', 'Семь эффектов босого бега — с этого гайда начинается вся категория.', 'free', 'beginner',
       5, array['закаливание', 'начало', 'обувь']::text[], null, 0, true
  from public.categories c where c.slug = 'barefoot'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'barefoot-dew', c.id, 'Бег по росе', 'Самая чистая вода, доступная утром и вечером. Хватает 20–30 секунд.', 'premium', 'beginner',
       6, array['вода', 'закаливание', 'обувь', 'роса']::text[], null, 1, true
  from public.categories c where c.slug = 'barefoot'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'barefoot-snow', c.id, 'Бег по снегу', 'От 5 до 30 секунд по чистому снегу после пробежки — и сразу обратно в обувь.', 'premium', 'regular',
       5, array['обувь', 'снег']::text[], 'Практика с холодом. При обострении хронических заболеваний сначала проконсультируйтесь с врачом.', 2, true
  from public.categories c where c.slug = 'barefoot'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'barefoot-pebbles', c.id, 'Бег по камешкам', 'Массаж ступней и поиск болевых точек. Утром бодрит, вечером снимает напряжение.', 'premium', 'regular',
       6, array['камешки', 'обувь', 'роса']::text[], null, 3, true
  from public.categories c where c.slug = 'barefoot'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'barefoot-shells', c.id, 'Ракушки: массаж стоп дома', 'Привезти с моря и стоять на них после сна.', 'premium', 'beginner',
       4, array['вода', 'камешки', 'обувь', 'пляж']::text[], null, 4, true
  from public.categories c where c.slug = 'barefoot'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'barefoot-water', c.id, 'Бег по воде и морю', 'Четыре эффекта сразу: очищение, закаливание, массаж и работа с органами.', 'premium', 'regular',
       8, array['вода', 'закаливание', 'камешки', 'обувь', 'пляж']::text[], null, 5, true
  from public.categories c where c.slug = 'barefoot'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'barefoot-sand', c.id, 'Бег по песку', 'Песок уходит из-под ног — и в работу включаются мышцы, которые молчат на твёрдом.', 'premium', 'regular',
       10, array['обувь', 'пляж']::text[], null, 6, true
  from public.categories c where c.slug = 'barefoot'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'run-in-rain', c.id, 'Бег в дождь', 'Заряд на 100–200% больше обычного.', 'premium', 'regular',
       5, array['вода', 'травмы']::text[], null, 7, true
  from public.categories c where c.slug = 'barefoot'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'style-heel-toe', c.id, 'Перекат с пятки на носок', 'Медленно, плавно, с максимальной амплитудой. 50–100 метров и смена стиля.', 'premium', 'regular',
       8, array['дыхание', 'обувь', 'техника']::text[], null, 0, true
  from public.categories c where c.slug = 'styles'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'style-forefoot', c.id, 'Бег на подушках', 'Ощущение парения: приземление на подушки, отталкивание разгибанием коленей.', 'premium', 'regular',
       8, array['обувь', 'техника', 'травмы']::text[], null, 1, true
  from public.categories c where c.slug = 'styles'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'style-flat-foot', c.id, 'Бег полной стопой', 'Хаотичные хлопки всей стопой — вибрации, которые пробуждают внутренние органы.', 'premium', 'regular',
       10, array['обувь']::text[], null, 2, true
  from public.categories c where c.slug = 'styles'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'style-toes', c.id, 'Бег на пальцах', 'Как прыгает олень: приземлился — сразу оттолкнулся, прыжок под 45°.', 'premium', 'regular',
       8, array['техника']::text[], null, 3, true
  from public.categories c where c.slug = 'styles'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'style-power-walk', c.id, 'Быстрая ходьба и скоробег', 'Чем правильно заканчивать пробежку: два-три подхода с раскачкой таза.', 'premium', 'beginner',
       6, array['техника']::text[], null, 4, true
  from public.categories c where c.slug = 'styles'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'one-run-assembly', c.id, 'Одна пробежка целиком', 'Как соединить техники, дыхание и завершение в единый выход.', 'premium', 'regular',
       25, array['дыхание', 'обувь', 'техника']::text[], null, 5, true
  from public.categories c where c.slug = 'styles'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'first-week', c.id, 'Первая неделя', 'Не начинайте с техники и километров. Начните с пяти минут — и повторите семь дней.', 'free', 'beginner',
       5, array['начало', 'обувь', 'роса', 'техника', 'травмы']::text[], null, 4, true
  from public.categories c where c.slug = 'start'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'run-before-cold', c.id, 'Бег перед закаливанием', 'Зачем разогревать тело до холодной воды.', 'premium', 'regular',
       6, array['дыхание', 'закаливание']::text[], 'Работа с холодом. При обострении хронических заболеваний сначала проконсультируйтесь с врачом.', 0, true
  from public.categories c where c.slug = 'hardening'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'after-snow', c.id, 'После снега: как согреться', 'Правило 5–10 секунд, которое отделяет закаливание от переохлаждения.', 'premium', 'regular',
       4, array['закаливание', 'обувь', 'снег', 'травмы']::text[], null, 1, true
  from public.categories c where c.slug = 'hardening'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'cold-entry-order', c.id, 'Порядок входа в холод', 'Пять шагов от разогрева до согревания и почему страх здесь союзник.', 'premium', 'regular',
       8, array['дыхание', 'закаливание']::text[], 'Не входите в холод в одиночку и на пределе. При обострении хронических заболеваний сначала врач.', 2, true
  from public.categories c where c.slug = 'hardening'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'winter-running', c.id, 'Бег зимой', 'Правило тёплого тела, дыхание на морозе и главная ошибка — после пробежки.', 'premium', 'regular',
       6, array['дыхание', 'закаливание', 'начало', 'обувь', 'снег', 'травмы']::text[], null, 3, true
  from public.categories c where c.slug = 'hardening'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'two-kinds-of-running', c.id, 'Два вида бега', 'Бег для долголетия и бег для спорта — это разные занятия с разными целями.', 'premium', 'beginner',
       5, array['долголетие']::text[], null, 0, true
  from public.categories c where c.slug = 'longevity'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'daily-norm', c.id, 'Ежедневная норма', 'Сколько бегать, чтобы накапливать здоровье, а не расходовать его.', 'premium', 'beginner',
       6, array['долголетие', 'дыхание', 'роса', 'травмы']::text[], null, 1, true
  from public.categories c where c.slug = 'longevity'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'injury-causes', c.id, 'Причины травм', 'Шесть причин, каждая из которых устраняется до пробежки, а не после.', 'free', 'beginner',
       5, array['начало', 'обувь', 'роса', 'техника', 'травмы']::text[], null, 0, true
  from public.categories c where c.slug = 'safety'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'when-not-to-run', c.id, 'Когда лучше не бежать', 'Дни, когда прогулка полезнее пробежки.', 'free', 'beginner',
       4, array['начало', 'травмы']::text[], 'При острых болях в суставах и позвоночнике, после недавних операций и при обострении хронических заболеваний сначала врач — потом бег.', 1, true
  from public.categories c where c.slug = 'safety'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'progression-and-volume', c.id, 'Сколько добавлять', 'Почему объём растёт медленнее, чем хочется, и что ломается при спешке.', 'premium', 'beginner',
       5, array['роса', 'травмы']::text[], null, 2, true
  from public.categories c where c.slug = 'safety'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'pain-is-a-signal', c.id, 'Боль — это сигнал', 'Что делать, когда заболело колено, и почему через боль бежать нельзя.', 'free', 'beginner',
       4, array['обувь', 'техника', 'травмы']::text[], 'При острых болях в суставах и позвоночнике, после недавних операций и при обострении хронических заболеваний сначала врач — потом бег.', 3, true
  from public.categories c where c.slug = 'safety'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'motivation-threshold', c.id, 'Порог: как выйти, когда не хочется', 'Самая трудная часть пробежки — дверь. Что с этим делать в тяжёлый день.', 'free', 'beginner',
       5, array['начало', 'роса']::text[], null, 0, true
  from public.categories c where c.slug = 'habit'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'after-a-break', c.id, 'Возвращение после перерыва', 'Сорвались и бросили — как начать заново и не застрять на том же месте.', 'free', 'beginner',
       5, array['начало', 'травмы']::text[], null, 1, true
  from public.categories c where c.slug = 'habit'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;
insert into public.guides (slug, category_id, title, summary, tier, level, duration_min, tags, contraindications, order_index, published)
select 'sleep-and-recovery', c.id, 'Сон и восстановление', 'Что происходит между пробежками и почему отдых — часть практики.', 'premium', 'beginner',
       5, array['долголетие']::text[], null, 2, true
  from public.categories c where c.slug = 'habit'
  on conflict (slug) do update set
    category_id = excluded.category_id, title = excluded.title, summary = excluded.summary,
    tier = excluded.tier, level = excluded.level, duration_min = excluded.duration_min,
    tags = excluded.tags, contraindications = excluded.contraindications,
    order_index = excluded.order_index, published = excluded.published;

-- Шаги ----------------------------------------------------------------
-- Переписываются целиком: состав и порядок шагов меняются вместе.
delete from public.guide_steps;
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Разминка', 'Перед бегом — приседания и растяжка. Если бежите легко, ради дыхания, разминку можно пропустить: она нужна там, где планируется нагрузка.', 180,
       '["Приседания","Растяжка ног","Растяжка спины"]'::jsonb, 'РАЗМИНКА'
  from public.guides g where g.slug = 'first-run-500m';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Выберите место', 'Лес — лучший вариант. Подойдут поле с разнотравьем и берег моря. Стадион с резиновым покрытием — плохой выбор: запах резины идёт в лёгкие. У дороги не бегайте вовсе.', null,
       '["Не у дороги","Мягкая поверхность"]'::jsonb, 'ЛУЧШИЕ МЕСТА ДЛЯ БЕГА'
  from public.guides g where g.slug = 'first-run-500m';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Первые 500 метров', 'Первый раз — ровно 500 метров, не больше. Дальше 1 км, потом 2 км: дистанция растёт постепенно. Начинать сразу с 5 км нельзя.', 300,
       '[]'::jsonb, 'КАК НАЧИНАТЬ'
  from public.guides g where g.slug = 'first-run-500m';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Держите свой темп', 'Бегите в кайф, без напряжения. Устали — перешли на шаг, это нормально и не считается провалом.', null,
       '[]'::jsonb, 'ОТВЕТЫ НА ЧАСТЫЕ ВОПРОСЫ'
  from public.guides g where g.slug = 'first-run-500m';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 4, 'Завершение', 'Закончите быстрой ходьбой: раскачивайте таз вправо-влево, ускорьтесь на 30–50 метров, подержите скорость и замедлитесь. Два-три подхода завершают пробежку.', 120,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'first-run-500m';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Бегите в кайф', 'Темп правильный, когда бежится без напряжения. Устали — перешли на шаг. Это нормально.', null,
       '[]'::jsonb, 'ОТВЕТЫ НА ЧАСТЫЕ ВОПРОСЫ'
  from public.guides g where g.slug = 'choose-pace';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Слушайте тело', 'Есть дни, когда лучше просто пройтись, а не бежать. Перепады температуры и давления меняют готовность к нагрузке.', null,
       '[]'::jsonb, 'ВАЖНО'
  from public.guides g where g.slug = 'choose-pace';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Не перегружайтесь', 'Перегруз ведёт к потере энергии. Это минус, а не плюс: смысл пробежки — прибавить сил, а не отнять.', null,
       '[]'::jsonb, 'ВАЖНО'
  from public.guides g where g.slug = 'choose-pace';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Решите, нужна ли она', 'Планируете нагрузку — разминка обязательна. Бежите легко, ради дыхания — можно без неё.', null,
       '[]'::jsonb, 'РАЗМИНКА'
  from public.guides g where g.slug = 'warmup';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Приседания', 'Приседания разогревают ноги перед стартом.', 90,
       '[]'::jsonb, 'РАЗМИНКА'
  from public.guides g where g.slug = 'warmup';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Растяжка', 'Растяжка завершает разминку и снимает скованность перед первыми метрами.', 90,
       '[]'::jsonb, 'РАЗМИНКА'
  from public.guides g where g.slug = 'warmup';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Руки в работе', 'Уже на бегу сжимайте и разжимайте кисти: это прокачивает руки и улучшает кровообращение.', null,
       '[]'::jsonb, 'ДВИЖЕНИЕ РУК'
  from public.guides g where g.slug = 'warmup';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Два окна в сутках', 'Утром на рассвете и вечером на закате — два лучших времени для бега.', null,
       '[]'::jsonb, 'КОГДА БЕГАТЬ'
  from public.guides g where g.slug = 'when-to-run';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Зачем дважды', 'Кислород — самая важная еда для тела. Утро и вечер — два приёма этой еды.', null,
       '[]'::jsonb, 'ГЛАВНАЯ КОНЦЕПЦИЯ — БЕЖАТЬ ЧТОБЫ ДЫШАТЬ'
  from public.guides g where g.slug = 'when-to-run';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Что даёт каждое время', 'Утренняя пробежка пробуждает организм, вечерняя сбрасывает накопленное за день напряжение.', null,
       '[]'::jsonb, 'ПСИХОЛОГИЧЕСКАЯ ПОЛЬЗА'
  from public.guides g where g.slug = 'when-to-run';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Можно ли каждый день', 'Да, нужно. Два раза в день — норма, а не подвиг.', null,
       '[]'::jsonb, 'ОТВЕТЫ НА ЧАСТЫЕ ВОПРОСЫ'
  from public.guides g where g.slug = 'when-to-run';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Кислород — первая еда', 'Задача бега — наполнить организм кислородом. Кислород важнее любой другой еды для тела.', null,
       '[]'::jsonb, 'ГЛАВНАЯ КОНЦЕПЦИЯ — БЕЖАТЬ ЧТОБЫ ДЫШАТЬ'
  from public.guides g where g.slug = 'run-to-breathe';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Норма — тысяча вдохов', '1,5–2 км, это примерно 1000 вдохов и выдохов, полностью насыщают все органы. Больше — избыток, как переполненный стакан.', null,
       '[]'::jsonb, 'ГЛАВНАЯ КОНЦЕПЦИЯ — БЕЖАТЬ ЧТОБЫ ДЫШАТЬ'
  from public.guides g where g.slug = 'run-to-breathe';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Сколько это по времени', '1,5–2 км — это 10–15 минут. Два раза в день, утром и вечером.', 600,
       '[]'::jsonb, 'ОТВЕТЫ НА ЧАСТЫЕ ВОПРОСЫ'
  from public.guides g where g.slug = 'run-to-breathe';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Где дышать полной грудью', 'Вдох и выдох ртом — только в чистых местах: лес, поляна, море. У дороги выхлопы расходятся на 1–2 километра и накапливаются в организме.', null,
       '[]'::jsonb, 'ТЕХНИКА ДЫХАНИЯ'
  from public.guides g where g.slug = 'run-to-breathe';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Начало: вдох и выдох ртом', 'Первый отрезок пробежки дышите ртом на вдохе и на выдохе.', 240,
       '[]'::jsonb, 'ДЫХАНИЕ ВО ВРЕМЯ БЕГА'
  from public.guides g where g.slug = 'breathing-progression';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Середина: вдох ртом, выдох носом', 'Дальше переходите на смешанное дыхание: вдох по-прежнему ртом, выдох уже носом.', 240,
       '[]'::jsonb, 'ДЫХАНИЕ ВО ВРЕМЯ БЕГА'
  from public.guides g where g.slug = 'breathing-progression';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Финал: только нос', 'Последний отрезок — вдох и выдох носом. Носовое дыхание включает терморегуляцию и обогревает тело.', 240,
       '[]'::jsonb, 'ДЫХАНИЕ ВО ВРЕМЯ БЕГА'
  from public.guides g where g.slug = 'breathing-progression';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Где эту технику не применять', 'Только в чистом воздухе. Рядом с дорогой глубокое дыхание вредно: тяжёлые металлы из выхлопов не выводятся из организма.', null,
       '[]'::jsonb, 'ВРЕД БЕГА'
  from public.guides g where g.slug = 'breathing-progression';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Сбросьте темп', 'Техника работает только на медленном беге: скорость здесь мешает.', null,
       '[]'::jsonb, 'ТЕХНИКА ДЫХАНИЯ'
  from public.guides g where g.slug = 'max-breathing';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Вдох на полную грудь', 'Вдыхайте максимально, на всю грудную клетку.', 300,
       '[]'::jsonb, 'ТЕХНИКА ДЫХАНИЯ'
  from public.guides g where g.slug = 'max-breathing';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Выдох с задержкой', 'Выдох делайте с задержкой в 1–2 секунды.', null,
       '[]'::jsonb, 'ТЕХНИКА ДЫХАНИЯ'
  from public.guides g where g.slug = 'max-breathing';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Чеснок на пробежке', 'Практика Федерации: пожёвывать зубчик чеснока во время бега — так делают для профилактики вирусов.', null,
       '[]'::jsonb, 'ТЕХНИКА ДЫХАНИЯ'
  from public.guides g where g.slug = 'max-breathing';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Что это за сигнал', 'Боль в боку означает нехватку кислорода — отзывается печень или селезёнка.', null,
       '[]'::jsonb, 'ДЫХАНИЕ ВО ВРЕМЯ БЕГА'
  from public.guides g where g.slug = 'side-stitch';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Участите дыхание', 'Начните дышать чаще и выдыхайте полностью, до конца.', 60,
       '[]'::jsonb, 'ДЫХАНИЕ ВО ВРЕМЯ БЕГА'
  from public.guides g where g.slug = 'side-stitch';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Снизьте нагрузку', 'Если не отпускает — перейдите на шаг. Устал и пошёл пешком — это нормально.', null,
       '[]'::jsonb, 'ОТВЕТЫ НА ЧАСТЫЕ ВОПРОСЫ'
  from public.guides g where g.slug = 'side-stitch';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Гибкая подошва', 'Подошва должна быть очень гибкой — это первое требование.', null,
       '[]'::jsonb, 'ВЫБОР КРОССОВОК'
  from public.guides g where g.slug = 'choose-shoes';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Размер с запасом', 'Берите на полразмера больше: стопе нужна свобода.', null,
       '[]'::jsonb, 'ВЫБОР КРОССОВОК'
  from public.guides g where g.slug = 'choose-shoes';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Только кроссовки', 'Бегать нужно именно в кроссовках. Не в тапочках и не в ботинках.', null,
       '[]'::jsonb, 'ОТВЕТЫ НА ЧАСТЫЕ ВОПРОСЫ'
  from public.guides g where g.slug = 'choose-shoes';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Чем грозит ошибка', 'Неподходящая обувь — одна из причин травм наравне с неправильной техникой и чрезмерными нагрузками.', null,
       '[]'::jsonb, 'ТРАВМЫ — ПРИЧИНЫ'
  from public.guides g where g.slug = 'choose-shoes';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Пройдите маршрут в обуви', 'Перед тем как разуться, обязательно пройдите весь маршрут в обуви.', 300,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'prepare-route';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Уберите стекло и металл', 'Соберите с трассы стекло и металлический мусор.', null,
       '["Стекло убрано","Металл убран"]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'prepare-route';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Проверяйте каждый день', 'Осмотр повторяется перед каждой пробежкой: кто-то мог разбить бутылку накануне.', null,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'prepare-route';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Выберите поверхность', 'Трава, лес, тропинка, песок. Асфальт — последний выбор.', null,
       '[]'::jsonb, 'ОТВЕТЫ НА ЧАСТЫЕ ВОПРОСЫ'
  from public.guides g where g.slug = 'prepare-route';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Лес — лучший вариант', 'Лес стоит на первом месте среди мест для бега.', null,
       '[]'::jsonb, 'ЛУЧШИЕ МЕСТА ДЛЯ БЕГА'
  from public.guides g where g.slug = 'where-to-run';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Поле с разнотравьем', 'В поле вы дышите пыльцой — это дополнительное питание.', null,
       '[]'::jsonb, 'ЛУЧШИЕ МЕСТА ДЛЯ БЕГА'
  from public.guides g where g.slug = 'where-to-run';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Берег моря', 'На берегу работают соль и свежий воздух.', null,
       '[]'::jsonb, 'ЛУЧШИЕ МЕСТА ДЛЯ БЕГА'
  from public.guides g where g.slug = 'where-to-run';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Чего избегать', 'Стадион с резиновым покрытием вреден: запах резины попадает в лёгкие. У дороги — категорически нет: выхлопы расходятся на 1–2 километра, и тяжёлые металлы из организма не выводятся.', null,
       '[]'::jsonb, 'ВРЕД БЕГА'
  from public.guides g where g.slug = 'where-to-run';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Работа со ступнями', 'Босой бег даёт самомассаж внутренних органов через ступни, прокачивает их гибкость и очищает кожу ног.', null,
       '[]'::jsonb, 'ПОЛЬЗА БЕГА БОСИКОМ'
  from public.guides g where g.slug = 'why-barefoot';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Холод и терморегуляция', 'Ещё два эффекта — закаливание и тренировка терморегуляции.', null,
       '[]'::jsonb, 'ПОЛЬЗА БЕГА БОСИКОМ'
  from public.guides g where g.slug = 'why-barefoot';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Опора и заряд', 'Появляется заряд от земли и ощущение опоры и уверенности.', null,
       '[]'::jsonb, 'ПОЛЬЗА БЕГА БОСИКОМ'
  from public.guides g where g.slug = 'why-barefoot';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Проверьте трассу', 'Перед тем как разуться, пройдите маршрут в обуви и уберите стекло и металлический мусор. Проверять нужно каждый день: кто-то мог разбить бутылку накануне.', null,
       '["Прошёл в обуви","Стекло и металл убраны"]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'why-barefoot';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Проверьте трассу', 'Перед тем как разуться, пройдите маршрут в обуви и уберите стекло и металлический мусор. Проверять нужно каждый день: кто-то мог разбить бутылку накануне.', null,
       '["Прошёл в обуви","Стекло и металл убраны"]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-dew';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Выйдите к росе', 'Роса доступна утром и вечером — это самая чистая вода, какая бывает под ногами.', null,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-dew';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, '20–30 секунд бега', 'Даже 20–30 секунд бега по росе дают новый прилив энергии. Ноги напитываются влагой, кожа очищается.', 30,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-dew';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Что меняется по сезону', 'Летом роса прохладная. Осенью и весной она тренирует терморегуляцию.', null,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-dew';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Сначала пробежка', 'Лучше всего заходить на снег после пробежки: тело уже разогрето.', null,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-snow';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Проверьте трассу', 'Перед тем как разуться, пройдите маршрут в обуви и уберите стекло и металлический мусор. Проверять нужно каждый день: кто-то мог разбить бутылку накануне.', null,
       '["Прошёл в обуви","Стекло и металл убраны"]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-snow';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, '5–30 секунд по чистому снегу', 'Разуйтесь и пробегите по чистому снегу. Пяти-тридцати секунд достаточно и детям, и взрослым.', 20,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-snow';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Сразу согреться', 'После снега обувайтесь через 5–10 секунд и сразу бегите согреваться.', 10,
       '[]'::jsonb, 'ВАЖНО'
  from public.guides g where g.slug = 'barefoot-snow';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Проверьте трассу', 'Перед тем как разуться, пройдите маршрут в обуви и уберите стекло и металлический мусор. Проверять нужно каждый день: кто-то мог разбить бутылку накануне.', null,
       '["Прошёл в обуви","Стекло и металл убраны"]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-pebbles';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Что происходит со ступнями', 'Камешки массируют ступни и через нервные окончания — внутренние органы.', 120,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-pebbles';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Найдите болевые точки', 'Практика позволяет найти болевые точки и связать их с состоянием органов.', null,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-pebbles';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Выберите время', 'Утром камешки пробуждают тело, вечером снимают напряжение.', null,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-pebbles';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Соберите ракушки', 'Ракушки собирают после шторма или привозят с моря.', null,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-shells';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Стойте после сна', 'Дома вставайте на ракушки сразу после сна — это мягкий массаж стоп.', 120,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-shells';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Зачем это', 'Через ступни идёт самомассаж внутренних органов, а сами стопы становятся гибче.', null,
       '[]'::jsonb, 'ПОЛЬЗА БЕГА БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-shells';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Проверьте трассу', 'Перед тем как разуться, пройдите маршрут в обуви и уберите стекло и металлический мусор. Проверять нужно каждый день: кто-то мог разбить бутылку накануне.', null,
       '["Прошёл в обуви","Стекло и металл убраны"]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-water';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Ступни в воде', 'Первое, что происходит: ступни очищаются и впитывают влагу.', 180,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-water';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Прохладная вода закаляет', 'Прохладная вода работает как направленная терморегуляция.', null,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-water';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Неровности дна', 'Дно даёт самомассаж, а через нервные окончания включаются внутренние органы.', null,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-water';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Проверьте трассу', 'Перед тем как разуться, пройдите маршрут в обуви и уберите стекло и металлический мусор. Проверять нужно каждый день: кто-то мог разбить бутылку накануне.', null,
       '["Прошёл в обуви","Стекло и металл убраны"]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-sand';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Почему тяжело — это плюс', 'Песок двигается под ногами, поэтому включаются дополнительные мышцы, не работающие на твёрдом покрытии.', null,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-sand';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Спокойный темп', 'По песку бегут в спокойном темпе, не разгоняясь.', 420,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-sand';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Наберитесь терпения', 'Эффект раскрывается полностью минимум через 3–4 недели практики.', null,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'barefoot-sand';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Не отменяйте пробежку', 'Бег под дождём даёт заряд на 100–200% больше обычного.', null,
       '[]'::jsonb, 'БЕГ В ДОЖДЬ'
  from public.guides g where g.slug = 'run-in-rain';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Как к этому относиться', 'Дождь — это благодать: вода с небес питает всё вокруг. Бежать в дождь естественно и мощно.', 600,
       '[]'::jsonb, 'БЕГ В ДОЖДЬ'
  from public.guides g where g.slug = 'run-in-rain';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Сверьтесь с самочувствием', 'Перепады температуры и давления влияют на готовность к нагрузке. Есть дни, когда лучше просто пройтись.', null,
       '[]'::jsonb, 'ВАЖНО'
  from public.guides g where g.slug = 'run-in-rain';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Замедлитесь', 'Перекат выполняется медленно и плавно. Скорость здесь не нужна.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-heel-toe';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Максимальная амплитуда', 'Главное — прокатить стопу с максимальной амплитудой, от пятки до носка.', 180,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-heel-toe';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Оттолкнитесь пальцами', 'Завершайте перекат отталкиванием пальцами в лёгкий прыжок.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-heel-toe';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Смените стиль', 'Дистанция стиля — 50–100 метров, дальше переходите к следующему.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-heel-toe';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Приземление на подушки', 'Ставьте стопу на подушки, минуя пятку.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-forefoot';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Отталкивание коленями', 'Отталкивайтесь разгибанием коленей — так возникает ощущение парения.', 180,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-forefoot';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Плавность и расслабление', 'Держите концентрацию на плавности и расслаблении, а не на скорости.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-forefoot';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Дистанция', 'Стиль держат 100–200 метров.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-forefoot';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Хлопайте стопой', 'Хаотично хлопайте всей стопой об землю — ровный ритм здесь не нужен.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-flat-foot';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Зачем это', 'Такие хлопки создают вибрации и пробуждают внутренние органы.', 240,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-flat-foot';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Дистанция по ощущениям', 'От 100 до 500 метров — ориентируйтесь на самочувствие.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-flat-foot';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Пройдитесь и прислушайтесь', 'После — 50 метров спокойной ходьбы и внимание к тому, что чувствует тело.', 60,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-flat-foot';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Приземлился — оттолкнулся', 'Приземляйтесь на пальцы и сразу отталкивайтесь, без паузы. Так прыгает олень.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-toes';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Прыжок под 45°', 'Направляйте прыжок под 45 градусов по ходу бега.', 180,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-toes';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Спокойный темп', 'Темп спокойный, скорость выбирайте по ощущениям.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-toes';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Держите ритм', 'Главное в этом стиле — ритм и плавность.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-toes';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Это финал пробежки', 'Скоробег выполняется в конце тренировки, а не в начале.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-power-walk';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Раскачивайте таз', 'Раскачивайте таз вправо-влево — в этом суть движения.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-power-walk';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Ускорьтесь и замедлитесь', 'Ускорьтесь на 30–50 метров, подержите скорость, затем замедляйтесь.', 60,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-power-walk';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Два-три подхода', 'Двух-трёх подходов достаточно, чтобы завершить пробежку.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'style-power-walk';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Вход: полной стопой', 'Начните с бега полной стопой — 100–500 метров. Вибрации будят тело, и по его отклику видно, на что вы готовы сегодня.', 240,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'one-run-assembly';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Основа: спокойный бег', 'Дальше 1,5–2 километра в темпе разговора. Это около 1000 вдохов — ровно столько нужно для насыщения организма кислородом.', 900,
       '[]'::jsonb, 'ГЛАВНАЯ КОНЦЕПЦИЯ — БЕЖАТЬ ЧТОБЫ ДЫШАТЬ'
  from public.guides g where g.slug = 'one-run-assembly';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Середина: техники', 'В середине — подушки на 100–200 метров и пальцы на 50–100 метров. Меняйте стиль раньше, чем забьются мышцы.', 300,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'one-run-assembly';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Выход: скоробег', 'Завершите быстрой ходьбой: раскачивайте таз, ускорьтесь на 30–50 метров, подержите скорость и замедлитесь. Два-три подхода.', 180,
       '[]'::jsonb, 'ВИДЫ БЕГА'
  from public.guides g where g.slug = 'one-run-assembly';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 4, 'И только потом растяжка', 'Растяжку делайте после скоробега, на горячем теле: так она проходит мягче и безопаснее.', 180,
       '[]'::jsonb, 'РАЗМИНКА'
  from public.guides g where g.slug = 'one-run-assembly';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Пять минут по траве', 'Начните не с техники и не с километров, а с пяти минут босиком по траве. Повторите это семь дней подряд — остальное встанет на место само.', 300,
       '[]'::jsonb, 'ПОВЕРХНОСТИ — ДОЗИРОВКА'
  from public.guides g where g.slug = 'first-week';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Каждый день важнее длины', 'Пять минут ежедневно дают телу больше, чем час раз в неделю. Регулярность здесь важнее объёма.', null,
       '[]'::jsonb, 'ПРОГРЕССИЯ И ОБЪЁМ'
  from public.guides g where g.slug = 'first-week';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Если появилась боль', 'Появилась боль или дискомфорт — вернитесь на шаг назад и задержитесь там на неделю. Стопа, которая десятилетиями жила в обуви, не станет сильной за одну пробежку.', null,
       '[]'::jsonb, 'БЕГ ЧЕРЕЗ БОЛЬ'
  from public.guides g where g.slug = 'first-week';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Сначала разогрев', 'Перед закаливанием бегут ради одного — разогреть тело до контакта с холодной водой.', 300,
       '[]'::jsonb, 'ВИДЫ БЕГА ПО ЦЕЛЯМ'
  from public.guides g where g.slug = 'run-before-cold';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Что тренируется', 'Босой бег даёт закаливание и тренировку терморегуляции.', null,
       '[]'::jsonb, 'ПОЛЬЗА БЕГА БОСИКОМ'
  from public.guides g where g.slug = 'run-before-cold';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Дышите носом', 'Носовое дыхание включает терморегуляцию и обогревает тело — переходите на него до холода.', null,
       '[]'::jsonb, 'ДЫХАНИЕ ВО ВРЕМЯ БЕГА'
  from public.guides g where g.slug = 'run-before-cold';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Снимите обувь на 5–10 секунд', 'После снега разуйтесь всего на 5–10 секунд.', 10,
       '[]'::jsonb, 'ВАЖНО'
  from public.guides g where g.slug = 'after-snow';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Сразу обувайтесь', 'Обувайтесь немедленно и бегите согреваться — пауза здесь лишняя.', null,
       '[]'::jsonb, 'ВАЖНО'
  from public.guides g where g.slug = 'after-snow';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Сколько снега достаточно', 'Пяти-тридцати секунд на снегу хватает и детям, и взрослым. Больше не нужно.', null,
       '[]'::jsonb, 'БЕГ БОСИКОМ'
  from public.guides g where g.slug = 'after-snow';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Разогрейтесь', 'Сначала пробежка до устойчивого тепла и лёгкой испарины. Холод принимает только разогретое тело.', 600,
       '[]'::jsonb, 'ЗАКАЛИВАНИЕ — ПОРЯДОК ДЕЙСТВИЙ'
  from public.guides g where g.slug = 'cold-entry-order';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Выровняйте дыхание', 'Дыхание спокойное, без задержек и накачки. Входите в холод на выдохе и без прыжка.', null,
       '[]'::jsonb, 'ЗАКАЛИВАНИЕ — ПОРЯДОК ДЕЙСТВИЙ'
  from public.guides g where g.slug = 'cold-entry-order';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Выходите раньше', 'Выходите раньше, чем захочется выйти. Согревайтесь движением, а не горячей водой.', null,
       '[]'::jsonb, 'ЗАКАЛИВАНИЕ — ПОРЯДОК ДЕЙСТВИЙ'
  from public.guides g where g.slug = 'cold-entry-order';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Страх — датчик, а не слабость', 'Тревога перед холодом означает, что ресурса пока мало. Не ломайте сигнал волей: разогрейтесь дольше, сократите время, вернитесь завтра.', null,
       '[]'::jsonb, 'ЗАКАЛИВАНИЕ — ПОРЯДОК ДЕЙСТВИЙ'
  from public.guides g where g.slug = 'cold-entry-order';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Только на разогретое тело', 'Снимать обувь зимой можно только на разогретое тело и только в движении. Стоять босиком на снегу — не закаливание, пробежать по нему несколько секунд — да.', null,
       '[]'::jsonb, 'БЕГ ЗИМОЙ'
  from public.guides g where g.slug = 'winter-running';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Первый раз — пять секунд', 'Первый выход по снегу — 5 секунд, не больше. Снег чистый и ровный, без наста и льда. Рядом сухое полотенце и тёплые носки.', 5,
       '["Тело разогрето","Снег чистый","Полотенце и носки рядом"]'::jsonb, 'БЕГ ЗИМОЙ'
  from public.guides g where g.slug = 'winter-running';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Дыхание на морозе', 'Ртом на холоде не дышат: вдох носом, воздух успевает согреться. Если носом не хватает — темп слишком высокий для этой погоды.', null,
       '[]'::jsonb, 'БЕГ ЗИМОЙ'
  from public.guides g where g.slug = 'winter-running';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Главное — после', 'Выходите слегка мёрзнущим: через пять минут бега станет тепло. После пробежки сразу переоденьтесь в сухое — основное переохлаждение случается не на бегу, а после него.', null,
       '[]'::jsonb, 'БЕГ ЗИМОЙ'
  from public.guides g where g.slug = 'winter-running';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Бег для долголетия', 'Он нужен 80% людей: и спортсменам после карьеры, и обычным людям любого возраста.', null,
       '[]'::jsonb, 'ДВА ВИДА БЕГА'
  from public.guides g where g.slug = 'two-kinds-of-running';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Бег для спорта', 'Марафоны, соревнования, дистанции от 10 км — это территория профессионалов.', null,
       '[]'::jsonb, 'ДВА ВИДА БЕГА'
  from public.guides g where g.slug = 'two-kinds-of-running';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Тело как транспорт', 'Тело — транспортное средство Души, и ежедневный уход за ним накапливает здоровье.', null,
       '[]'::jsonb, 'ВИДЫ БЕГА ПО ЦЕЛЯМ'
  from public.guides g where g.slug = 'two-kinds-of-running';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Дистанция', '1,5–2 км за раз — примерно 1000 вдохов и выдохов. Этого достаточно для насыщения организма кислородом.', null,
       '[]'::jsonb, 'ГЛАВНАЯ КОНЦЕПЦИЯ — БЕЖАТЬ ЧТОБЫ ДЫШАТЬ'
  from public.guides g where g.slug = 'daily-norm';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Частота', 'Два раза в день — утром и вечером. Каждый день можно и нужно.', 600,
       '[]'::jsonb, 'ОТВЕТЫ НА ЧАСТЫЕ ВОПРОСЫ'
  from public.guides g where g.slug = 'daily-norm';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Почему не больше', 'Больше — избыток, как переполненный стакан. Перегруз ведёт к потере энергии.', null,
       '[]'::jsonb, 'ВАЖНО'
  from public.guides g where g.slug = 'daily-norm';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Что это даёт голове', 'Появляется вера в преодоление препятствий, приходят вдохновение и новые идеи. Утром бег пробуждает организм, вечером сбрасывает негативную энергию.', null,
       '[]'::jsonb, 'ПСИХОЛОГИЧЕСКАЯ ПОЛЬЗА'
  from public.guides g where g.slug = 'daily-norm';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Место и техника', 'Две первые причины — бег у дороги и неправильная техника.', null,
       '[]'::jsonb, 'ТРАВМЫ — ПРИЧИНЫ'
  from public.guides g where g.slug = 'injury-causes';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Нагрузка и обувь', 'Дальше идут чрезмерные нагрузки без отдыха и неподходящая обувь.', null,
       '[]'::jsonb, 'ТРАВМЫ — ПРИЧИНЫ'
  from public.guides g where g.slug = 'injury-causes';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Мышцы и вес', 'Замыкают список слабые неподготовленные мышцы и лишний вес: плюс 50 кг — большая нагрузка на колени и суставы.', null,
       '[]'::jsonb, 'ТРАВМЫ — ПРИЧИНЫ'
  from public.guides g where g.slug = 'injury-causes';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Что с этим делать', 'Увеличивайте дистанцию постепенно: 500 м, потом 1 км, потом 2 км. Никогда не начинайте сразу с 5 км.', null,
       '[]'::jsonb, 'КАК НАЧИНАТЬ'
  from public.guides g where g.slug = 'injury-causes';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Слушайте тело', 'Есть дни, когда лучше просто пройтись, а не бежать. Это не слабость, а нормальная часть практики.', null,
       '[]'::jsonb, 'ВАЖНО'
  from public.guides g where g.slug = 'when-not-to-run';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Погода и давление', 'Перепады температуры и давления влияют на готовность к нагрузке.', null,
       '[]'::jsonb, 'ВАЖНО'
  from public.guides g where g.slug = 'when-not-to-run';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Признак перегруза', 'Если после пробежки энергии меньше, а не больше — это перегруз, и это минус.', null,
       '[]'::jsonb, 'ВАЖНО'
  from public.guides g where g.slug = 'when-not-to-run';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Вес и суставы', 'При лишнем весе от 50 кг нагрузка ложится на суставы, колени и сосуды — начинать нужно осторожнее.', null,
       '[]'::jsonb, 'ВРЕД БЕГА'
  from public.guides g where g.slug = 'when-not-to-run';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Мышцы и сухожилия растут по-разному', 'Мышцы крепнут за недели, а сухожилия и суставы — за месяцы. Резкий рост объёма травмирует именно их, поэтому добавлять нужно понемногу.', null,
       '[]'::jsonb, 'ПРОГРЕССИЯ И ОБЪЁМ'
  from public.guides g where g.slug = 'progression-and-volume';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Ошибка первой недели', 'Самая частая ошибка — слишком много и сразу. Лучше меньше, но каждый день: регулярность даёт больше, чем один тяжёлый выход.', null,
       '[]'::jsonb, 'ПРОГРЕССИЯ И ОБЪЁМ'
  from public.guides g where g.slug = 'progression-and-volume';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Как понять, что перебрали', 'Опустошение после пробежки вместо заряда означает лишнюю нагрузку. Сократите объём и вернитесь к прежнему на следующий день.', null,
       '[]'::jsonb, 'ПРОГРЕССИЯ И ОБЪЁМ'
  from public.guides g where g.slug = 'progression-and-volume';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Боль не терпят', 'Боль — это не то, что нужно перетерпеть. Это сообщение. Тот, кто бежит сквозь неё, лечится потом гораздо дольше, чем отдыхал бы сейчас.', null,
       '[]'::jsonb, 'БЕГ ЧЕРЕЗ БОЛЬ'
  from public.guides g where g.slug = 'pain-is-a-signal';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Шаг назад', 'Появилась боль — сократите объём, вернитесь на шаг назад и задержитесь там. Это не отставание, а единственный способ не потерять недели.', null,
       '[]'::jsonb, 'БЕГ ЧЕРЕЗ БОЛЬ'
  from public.guides g where g.slug = 'pain-is-a-signal';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Проверьте причины', 'Чаще всего дело в одном из шести: бег у дороги, неправильная техника, нагрузки без отдыха, неподходящая обувь, слабые мышцы, лишний вес.', null,
       '["Поверхность и место","Техника","Отдых","Обувь"]'::jsonb, 'ТРАВМЫ — ПРИЧИНЫ'
  from public.guides g where g.slug = 'pain-is-a-signal';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Уменьшите обещание', 'В тяжёлый день не обещайте себе пробежку. Пообещайте выйти за дверь и пройти сто метров. Дальше тело обычно решает само.', null,
       '[]'::jsonb, 'МОТИВАЦИЯ, ЛЕНЬ И СРЫВЫ'
  from public.guides g where g.slug = 'motivation-threshold';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Это договор с собой', 'Каждый раз, когда вы вышли, хотя не хотелось, вы доказываете себе: ваше слово чего-то стоит. Уверенность собирается не из побед, а из выполненных обещаний самому себе.', null,
       '[]'::jsonb, 'МОТИВАЦИЯ, ЛЕНЬ И СРЫВЫ'
  from public.guides g where g.slug = 'motivation-threshold';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Своя территория', 'В жизни многое от нас не зависит. Но выйти утром и пробежать свой круг — зависит всегда. Это маленькая территория, где решаете вы, и она держит в трудные времена.', null,
       '[]'::jsonb, 'МОТИВАЦИЯ, ЛЕНЬ И СРЫВЫ'
  from public.guides g where g.slug = 'motivation-threshold';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Чего ждать от пробежки', 'Бег не убирает проблемы. Он меняет того, кто на них смотрит. После пробежки проблемы те же, но силы смотреть на них снова есть.', null,
       '[]'::jsonb, 'МОТИВАЦИЯ, ЛЕНЬ И СРЫВЫ'
  from public.guides g where g.slug = 'motivation-threshold';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Начните с посильного', 'Возвращайтесь с того объёма, который точно осилите, а не с того, на котором остановились. Иначе первая же пробежка повторит ту причину, по которой вы бросили.', null,
       '[]'::jsonb, 'МОТИВАЦИЯ, ЛЕНЬ И СРЫВЫ'
  from public.guides g where g.slug = 'after-a-break';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Первый раз — снова 500 метров', 'После долгого перерыва действует то же правило, что и на старте: 500 метров, потом километр, потом два. Сразу с пяти километров начинать нельзя.', null,
       '[]'::jsonb, 'КАК НАЧИНАТЬ'
  from public.guides g where g.slug = 'after-a-break';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Возвращаться назад — нормально', 'Если появилась боль или тяжесть, вернитесь на шаг назад и задержитесь там. Это не отставание: тело, которое отвыкло, не станет прежним за одну пробежку.', null,
       '[]'::jsonb, 'БЕГ ЧЕРЕЗ БОЛЬ'
  from public.guides g where g.slug = 'after-a-break';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 0, 'Ремонт идёт ночью', 'Тело, которое двигалось днём, глубоко спит ночью. Именно во сне идёт основной ремонт и обновление организма — движение днём и сон ночью связаны напрямую.', null,
       '[]'::jsonb, 'СОН И ВОССТАНОВЛЕНИЕ'
  from public.guides g where g.slug = 'sleep-and-recovery';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 1, 'Восстановление — это не нагрузка', 'Между пробежками восстанавливают сон и лёгкие дни, а не дополнительные тренировки. Геройство здесь работает против вас.', null,
       '[]'::jsonb, 'СОН И ВОССТАНОВЛЕНИЕ'
  from public.guides g where g.slug = 'sleep-and-recovery';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 2, 'Признак лишнего', 'Если после пробежки чувствуете опустошение, а не заряд, — нагрузка была лишней. Перегруз ведёт к потере энергии: это минус, а не плюс.', null,
       '[]'::jsonb, 'ПРОГРЕССИЯ И ОБЪЁМ'
  from public.guides g where g.slug = 'sleep-and-recovery';
insert into public.guide_steps (guide_id, order_index, title, body, duration_sec, checklist, source)
select g.id, 3, 'Профилактика вместо лечения', 'Проще каждый день делать простые вещи, чем потом годами восстанавливаться. Ежедневная практика — это профилактика, а не скорая помощь.', null,
       '[]'::jsonb, 'СОН И ВОССТАНОВЛЕНИЕ'
  from public.guides g where g.slug = 'sleep-and-recovery';

-- Программа -----------------------------------------------------------
insert into public.program_days (week, day, guide_id, note)
select 1, 1, g.id, 'Сначала причина, потом километры.'
  from public.guides g where g.slug = 'why-barefoot'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 1, 2, g.id, null
  from public.guides g where g.slug = 'when-not-to-run'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 1, 3, g.id, null
  from public.guides g where g.slug = 'prepare-route'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 1, 4, g.id, null
  from public.guides g where g.slug = 'choose-shoes'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 1, 5, g.id, 'Ровно 500 метров. Больше сегодня не нужно.'
  from public.guides g where g.slug = 'first-run-500m'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 1, 6, g.id, null
  from public.guides g where g.slug = 'warmup'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 1, 7, g.id, 'Итог недели: семь дней подряд важнее длины пробежки.'
  from public.guides g where g.slug = 'first-week'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 2, 1, g.id, null
  from public.guides g where g.slug = 'barefoot-dew'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 2, 2, g.id, null
  from public.guides g where g.slug = 'barefoot-pebbles'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 2, 3, g.id, null
  from public.guides g where g.slug = 'barefoot-shells'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 2, 4, g.id, null
  from public.guides g where g.slug = 'barefoot-water'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 2, 5, g.id, null
  from public.guides g where g.slug = 'barefoot-sand'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 2, 6, g.id, null
  from public.guides g where g.slug = 'where-to-run'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 2, 7, g.id, 'Итог недели: добавляем понемногу, а не рывком.'
  from public.guides g where g.slug = 'progression-and-volume'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 3, 1, g.id, null
  from public.guides g where g.slug = 'run-to-breathe'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 3, 2, g.id, null
  from public.guides g where g.slug = 'breathing-progression'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 3, 3, g.id, null
  from public.guides g where g.slug = 'max-breathing'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 3, 4, g.id, null
  from public.guides g where g.slug = 'side-stitch'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 3, 5, g.id, null
  from public.guides g where g.slug = 'when-to-run'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 3, 6, g.id, null
  from public.guides g where g.slug = 'daily-norm'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 3, 7, g.id, 'Итог недели: отдых — часть практики, а не пауза в ней.'
  from public.guides g where g.slug = 'sleep-and-recovery'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 4, 1, g.id, null
  from public.guides g where g.slug = 'style-flat-foot'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 4, 2, g.id, null
  from public.guides g where g.slug = 'style-forefoot'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 4, 3, g.id, null
  from public.guides g where g.slug = 'style-toes'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 4, 4, g.id, null
  from public.guides g where g.slug = 'style-heel-toe'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 4, 5, g.id, null
  from public.guides g where g.slug = 'style-power-walk'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 4, 6, g.id, 'Собираем всё в одну пробежку от начала до конца.'
  from public.guides g where g.slug = 'one-run-assembly'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;
insert into public.program_days (week, day, guide_id, note)
select 4, 7, g.id, 'Курс закончился. Дальше всё решает порог у двери.'
  from public.guides g where g.slug = 'motivation-threshold'
  on conflict (week, day) do update set guide_id = excluded.guide_id, note = excluded.note;

-- Тренер ---------------------------------------------------------------
-- Демонстрационная запись: имя и расписание заменяются реальными до
-- живого трафика. Telegram-адресат задаётся отдельно, не из seed.
insert into public.trainers (name, bio, timezone)
select 'Богдан', 'Глава Федерации Здоровья. Разбирает технику бега и закаливание.', 'Europe/Moscow'
  where not exists (select 1 from public.trainers);

commit;
