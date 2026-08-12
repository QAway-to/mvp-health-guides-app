# Переменные окружения

Создайте `apps/mobile/.env` со следующими ключами. Файл в `.gitignore` — в
репозиторий он не попадает.

```bash
# Supabase. anon-ключ публичный по замыслу: доступ к данным режет RLS, а не он.
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=

# RevenueCat — публичные SDK-ключи приложения (этап 4).
EXPO_PUBLIC_REVENUECAT_IOS_KEY=
EXPO_PUBLIC_REVENUECAT_ANDROID_KEY=
```

## Чего здесь быть не должно

`SUPABASE_SERVICE_ROLE_KEY`, секрет вебхука RevenueCat и `TELEGRAM_BOT_TOKEN`
задаются секретами Supabase (`supabase secrets set`), а не в `.env`
приложения. Всё с префиксом `EXPO_PUBLIC_` попадает в бандл и перестаёт быть
секретом — сервис-ключ там означал бы полный доступ к базе у любого, кто
распакует APK.
