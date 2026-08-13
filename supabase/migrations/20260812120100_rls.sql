-- Права доступа.
--
-- Здесь держится вся защита платного контента. Прятать премиум на клиенте
-- нельзя: список гайдов приходит одним запросом, и тексты уехали бы в
-- приложение вместе с ним — их достали бы из трафика, не открывая экран.
--
-- Второе правило: таблицу entitlements клиент не пишет никогда. Политик на
-- запись у неё нет вообще, единственный писатель — вебхук RevenueCat под
-- service role, который RLS обходит.

-- --------------------------------------------------------------------------
-- Функции проверки
-- --------------------------------------------------------------------------

-- Без параметра намеренно: has_premium(<чужой uuid>) позволял бы узнать,
-- есть ли подписка у другого человека.
create or replace function public.has_premium()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.entitlements e
    where e.user_id = (select auth.uid())
      and e.status = 'active'
      and (e.expires_at is null or e.expires_at > now())
  );
$$;

create or replace function public.guide_visible(g_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.guides g
    where g.id = g_id
      and g.published
      and (g.tier = 'free' or public.has_premium())
  );
$$;

revoke all on function public.has_premium() from public;
revoke all on function public.guide_visible(uuid) from public;
grant execute on function public.has_premium() to anon, authenticated;
grant execute on function public.guide_visible(uuid) to anon, authenticated;

-- --------------------------------------------------------------------------
-- Контент
-- --------------------------------------------------------------------------

alter table public.categories enable row level security;
alter table public.guides enable row level security;
alter table public.guide_steps enable row level security;
alter table public.program_days enable row level security;

-- Оглавление открыто всем: витрина продаёт подписку, а не прячется за ней.
create policy categories_read on public.categories
  for select to anon, authenticated
  using (true);

-- Карточка гайда — название, аннотация, длительность, противопоказания —
-- видна всем. Это витрина: если скрыть сам факт существования платных
-- гайдов, продавать подписку будет нечем, человек увидит короткий список
-- бесплатного и решит, что это всё содержимое приложения.
create policy guides_read on public.guides
  for select to anon, authenticated
  using (published);

-- А вот шаги — это и есть оплаченный текст, и он закрыт. Проверка идёт
-- функцией, а не подзапросом к guides: так правило остаётся верным, даже
-- если политику guides однажды ослабят.
create policy guide_steps_read on public.guide_steps
  for select to anon, authenticated
  using (public.guide_visible(guide_id));

-- Календарь программы — это расписание, а не контент: знать, что во вторник
-- второй недели идёт гайд про росу, не значит его прочитать.
create policy program_days_read on public.program_days
  for select to anon, authenticated
  using (true);

-- --------------------------------------------------------------------------
-- Пользователь
-- --------------------------------------------------------------------------

alter table public.profiles enable row level security;

create policy profiles_read_own on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

create policy profiles_update_own on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Строку создаёт триггер on_auth_user_created; вставка с клиента не нужна.

alter table public.entitlements enable row level security;

-- Только чтение своей строки — для экрана «Профиль». Ни insert, ни update,
-- ни delete: подписка, которую можно выписать себе запросом, не подписка.
create policy entitlements_read_own on public.entitlements
  for select to authenticated
  using ((select auth.uid()) = user_id);

alter table public.webhook_events enable row level security;
-- Политик нет вовсе: таблица видна только service role.

-- --------------------------------------------------------------------------
-- Прогресс и аналитика
-- --------------------------------------------------------------------------

alter table public.progress enable row level security;

create policy progress_read_own on public.progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy progress_insert_own on public.progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy progress_update_own on public.progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy progress_delete_own on public.progress
  for delete to authenticated
  using ((select auth.uid()) = user_id);

alter table public.events enable row level security;

-- События только пишутся. Чтение аналитики — задача владельца через service
-- role, а не приложения: выдача select пустила бы одного пользователя в
-- события всех остальных.
create policy events_insert_own on public.events
  for insert to anon, authenticated
  with check (user_id is not distinct from (select auth.uid()));

-- --------------------------------------------------------------------------
-- Тренер и запись
-- --------------------------------------------------------------------------

alter table public.trainers enable row level security;
alter table public.availability_rules enable row level security;
alter table public.availability_slots enable row level security;
alter table public.bookings enable row level security;

-- Карточка тренера видна и без подписки — иначе нечем объяснить, за что
-- платят. Telegram-адресат при этом наружу не уходит: колонка закрыта грантом.
create policy trainers_read on public.trainers
  for select to anon, authenticated
  using (active);

revoke select (telegram_chat_id) on public.trainers from anon, authenticated;

-- Правила расписания — внутренняя кухня тренера, приложению видны только
-- раскатанные из них слоты. Политик нет.

create policy slots_read on public.availability_slots
  for select to authenticated
  using (
    status = 'open'
    or exists (
      select 1
      from public.bookings b
      where b.slot_id = availability_slots.id
        and b.user_id = (select auth.uid())
    )
  );

create policy bookings_read_own on public.bookings
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- Записи создаёт и отменяет Edge Function book-slot: захват слота обязан быть
-- атомарным, а с клиента «проверил свободен — записался» это две операции, и
-- между ними успевает вклиниться второй человек.
