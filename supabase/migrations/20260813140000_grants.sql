-- Права на таблицы.
--
-- Политики RLS сужают доступ, но не открывают его: сначала роли нужен grant на
-- саму таблицу, иначе запрос падает с «permission denied» и до политики дело не
-- доходит. Раньше это работало само — Supabase выдавал anon и authenticated
-- полный набор прав на новые таблицы в public. В текущих образах Postgres
-- (17.6) дефолт урезан до TRUNCATE/REFERENCES/TRIGGER/MAINTAIN, без select и
-- без insert, поэтому права выдаём явно. Полагаться на дефолт не стоит в любом
-- случае: он менялся уже дважды.
--
-- Набор прав повторяет политики из 20260812120100_rls.sql ровно, без запаса.

-- --------------------------------------------------------------------------
-- Контент: витрина открыта всем, тексты шагов режет политика guide_steps_read
-- --------------------------------------------------------------------------

grant select on public.categories   to anon, authenticated;
grant select on public.guides       to anon, authenticated;
grant select on public.guide_steps  to anon, authenticated;
grant select on public.program_days to anon, authenticated;

-- --------------------------------------------------------------------------
-- Пользователь
-- --------------------------------------------------------------------------

grant select, update on public.profiles to authenticated;

-- Только чтение: подписка, которую можно выписать себе запросом, не подписка.
grant select on public.entitlements to authenticated;

-- --------------------------------------------------------------------------
-- Прогресс и аналитика
-- --------------------------------------------------------------------------

grant select, insert, update, delete on public.progress to authenticated;

-- События только пишутся, читать их приложению незачем. Колонка id — identity,
-- отдельного права на последовательность для вставки не требуется.
grant insert on public.events to anon, authenticated;

-- --------------------------------------------------------------------------
-- Тренер и запись
-- --------------------------------------------------------------------------

-- Права перечислены по колонкам, а не на таблицу целиком: telegram_chat_id —
-- адресат уведомлений тренера, и наружу он уходить не должен. Табличный grant
-- с последующим `revoke select (telegram_chat_id)` эту колонку не закрыл бы —
-- в Postgres колоночный revoke не отменяет ранее выданное право на таблицу.
grant select (id, name, bio, avatar_url, timezone, active)
  on public.trainers to anon, authenticated;

grant select on public.availability_slots to authenticated;

-- Записи создаёт Edge Function book-slot под service role: захват слота обязан
-- быть одной операцией. Клиенту оставляем только чтение своих.
grant select on public.bookings to authenticated;

-- availability_rules и webhook_events клиенту не видны вовсе — грантов нет.

-- --------------------------------------------------------------------------
-- Служебная роль
-- --------------------------------------------------------------------------

-- service_role обходит RLS, но не гранты: без этого Edge Functions book-slot и
-- rc-webhook не смогли бы ни прочитать слот, ни записать entitlement.
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
