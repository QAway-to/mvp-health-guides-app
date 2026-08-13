-- Схема Федерации Здоровья.
--
-- Контент (категории, гайды, шаги, программа) наполняется сборкой из
-- content/guides.json и правится только миграциями: редактор меняет манифест,
-- а не строки в базе.
--
-- Пользовательские таблицы держат ровно то, что нужно приложению: прогресс,
-- права доступа, записи к тренеру и события воронки. Схема прав — в
-- следующей миграции, она важнее этой.

create extension if not exists pgcrypto;

-- --------------------------------------------------------------------------
-- Контент
-- --------------------------------------------------------------------------

create table public.categories (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  title        text not null,
  subtitle     text not null default '',
  order_index  integer not null default 0
);

create table public.guides (
  id                 uuid primary key default gen_random_uuid(),
  slug               text not null unique,
  category_id        uuid not null references public.categories (id) on delete restrict,
  title              text not null,
  summary            text not null default '',
  tier               text not null default 'free' check (tier in ('free', 'premium')),
  level              text not null default 'beginner' check (level in ('beginner', 'regular')),
  duration_min       integer not null default 5 check (duration_min > 0),
  tags               text[] not null default '{}',
  contraindications  text,
  order_index        integer not null default 0,
  published          boolean not null default true
);

create index guides_category_idx on public.guides (category_id, order_index);
create index guides_tags_idx on public.guides using gin (tags);

create table public.guide_steps (
  id            uuid primary key default gen_random_uuid(),
  guide_id      uuid not null references public.guides (id) on delete cascade,
  order_index   integer not null,
  title         text not null,
  body          text not null,
  duration_sec  integer check (duration_sec is null or duration_sec > 0),
  checklist     jsonb not null default '[]'::jsonb,
  -- Раздел prompts/persona.txt, откуда взяты факты шага. Хранится, чтобы
  -- происхождение любого утверждения можно было проверить прямо из базы.
  source        text not null,
  unique (guide_id, order_index)
);

create table public.program_days (
  id        uuid primary key default gen_random_uuid(),
  week      integer not null check (week between 1 and 4),
  day       integer not null check (day between 1 and 7),
  guide_id  uuid not null references public.guides (id) on delete restrict,
  note      text,
  unique (week, day)
);

-- --------------------------------------------------------------------------
-- Пользователь и доступ
-- --------------------------------------------------------------------------

create table public.profiles (
  id                  uuid primary key references auth.users (id) on delete cascade,
  display_name        text,
  source              text not null default '',
  -- A/B-бакет: тот же смысл, что в funnel_store бота, чтобы воронки сходились.
  bucket              text not null default 'A' check (bucket in ('A', 'B')),
  program_started_at  timestamptz,
  created_at          timestamptz not null default now()
);

-- Права доступа. Пишет только вебхук RevenueCat под service role — политик на
-- запись нет ни одной, см. следующую миграцию.
--
-- Состояний ровно два. Отмена подписки и проблема с оплатой доступ НЕ
-- закрывают: отменивший автопродление оплатил период до конца, а списание с
-- ошибкой ещё может пройти в льготный срок. Закрывает доступ только
-- наступивший expires_at — иначе мы отрубим человека, который нам заплатил.
create table public.entitlements (
  user_id                  uuid primary key references auth.users (id) on delete cascade,
  product_id               text not null,
  status                   text not null default 'active' check (status in ('active', 'expired')),
  store                    text not null
                             check (store in ('app_store', 'play_store', 'promo', 'other')),
  expires_at               timestamptz,
  -- Для экрана «Профиль»: показать «продлится 3 марта» или «не продлится».
  auto_renew               boolean not null default true,
  has_billing_issue        boolean not null default false,
  original_transaction_id  text,
  updated_at               timestamptz not null default now()
);

-- Журнал обработанных вебхуков: доставка «хотя бы один раз», поэтому один и
-- тот же event_id приходит повторно, и без дедупликации отмена подписки может
-- переиграть более свежее продление.
create table public.webhook_events (
  event_id     text primary key,
  source       text not null default 'revenuecat',
  received_at  timestamptz not null default now(),
  payload      jsonb not null
);

-- --------------------------------------------------------------------------
-- Прогресс и аналитика
-- --------------------------------------------------------------------------

create table public.progress (
  user_id          uuid not null references auth.users (id) on delete cascade,
  guide_id         uuid not null references public.guides (id) on delete cascade,
  status           text not null default 'in_progress'
                     check (status in ('in_progress', 'completed')),
  completed_steps  integer[] not null default '{}',
  updated_at       timestamptz not null default now(),
  completed_at     timestamptz,
  primary key (user_id, guide_id)
);

create table public.events (
  id          bigint generated always as identity primary key,
  user_id     uuid references auth.users (id) on delete set null,
  name        text not null,
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

create index events_created_idx on public.events (created_at desc);

-- --------------------------------------------------------------------------
-- Тренер и запись
-- --------------------------------------------------------------------------

create table public.trainers (
  id                uuid primary key default gen_random_uuid(),
  name              text not null,
  bio               text not null default '',
  avatar_url        text,
  timezone          text not null default 'Europe/Moscow',
  -- Куда слать уведомление о новой записи. Токен бота живёт в секретах
  -- Edge Function, здесь только адресат.
  telegram_chat_id  text,
  active            boolean not null default true
);

-- Расписание тренера правится правилами, а не отдельными слотами: слоты на
-- четыре недели вперёд раскатывает cron-функция roll-slots.
create table public.availability_rules (
  id            uuid primary key default gen_random_uuid(),
  trainer_id    uuid not null references public.trainers (id) on delete cascade,
  weekday       integer not null check (weekday between 0 and 6),
  time_of_day   time not null,
  duration_min  integer not null default 45 check (duration_min > 0),
  active        boolean not null default true,
  unique (trainer_id, weekday, time_of_day)
);

create table public.availability_slots (
  id          uuid primary key default gen_random_uuid(),
  trainer_id  uuid not null references public.trainers (id) on delete cascade,
  starts_at   timestamptz not null,
  ends_at     timestamptz not null,
  status      text not null default 'open' check (status in ('open', 'booked', 'closed')),
  unique (trainer_id, starts_at),
  check (ends_at > starts_at)
);

create index availability_slots_open_idx
  on public.availability_slots (starts_at)
  where status = 'open';

create table public.bookings (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  slot_id      uuid not null references public.availability_slots (id) on delete restrict,
  status       text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  topic        text not null default '',
  contact      text not null default '',
  meeting_url  text,
  created_at   timestamptz not null default now(),
  cancelled_at timestamptz
);

-- Второй рубеж против двойной брони: даже если атомарный захват слота
-- когда-нибудь сломают, база не даст записать двоих на одно время. Индекс
-- частичный — отменённая запись освобождает слот.
create unique index bookings_active_slot_idx
  on public.bookings (slot_id)
  where status = 'confirmed';

create index bookings_user_idx on public.bookings (user_id, created_at desc);

-- --------------------------------------------------------------------------
-- Служебное
-- --------------------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger progress_touch
  before update on public.progress
  for each row execute function public.touch_updated_at();

create trigger entitlements_touch
  before update on public.entitlements
  for each row execute function public.touch_updated_at();

-- Профиль на каждого зарегистрированного, включая анонимных: без него
-- прогресс некуда привязать, а первый экран открывается до всякого логина.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.profiles (id, bucket)
  values (
    new.id,
    -- Тот же детерминированный 50/50, что в funnel_store бота: бакет не
    -- должен меняться при переустановке приложения.
    case when get_byte(digest(new.id::text, 'sha256'), 0) % 2 = 0 then 'A' else 'B' end
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
