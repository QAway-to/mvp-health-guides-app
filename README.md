# Федерация Здоровья — мобильное приложение

Кросс-платформенное приложение (iOS + Android) по бегу босиком: пошаговые
текстовые гайды, четырёхнедельная программа, запись к тренеру. Часть гайдов
бесплатна, остальное и запись — по подписке.

Родственный проект — Telegram-бот
[`QAway-to/mvp-health-funnel-bot`](https://github.com/QAway-to/mvp-health-funnel-bot).
Он остаётся отдельным каналом привлечения; общее у них — база знаний
`prompts/persona.txt` и таксономия тем. Диалог с ИИ и видеоролики из приватного
канала в приложение не переносятся: `copy_message` вне Telegram не существует, а
вместо роликов — текст.

## Структура

```
apps/mobile/     Expo (React Native, TypeScript, expo-router)
  app/           маршруты: (tabs) + гайд + сессия + пейволл
  src/theme/     токены дизайн-системы Nike
  src/ui/        примитивы поверх токенов
  content/       база знаний и манифест гайдов
  tools/         сборка content/guides.json
supabase/        миграции, RLS, Edge Functions, seed
```

## Стек

| Слой | Решение |
|---|---|
| Приложение | Expo SDK 57, React Native 0.86, expo-router, TypeScript |
| Данные | Supabase (Postgres + RLS), TanStack Query с офлайн-кэшем |
| Оплата | Apple IAP + Google Play Billing через RevenueCat |
| Уведомления | expo-notifications |
| Дизайн | Nike design system; Oswald вместо Futura, Inter вместо Helvetica Now (кириллица) |

## Запуск

```bash
cd apps/mobile
npm install
# создать .env по образцу из apps/mobile/ENVIRONMENT.md
npm start
```

Проверка без запуска симулятора:

```bash
npm run typecheck
npx expo export --platform android   # бандл собирается — значит, ничего не сломано
```

## Дизайн-система

Токены — `apps/mobile/src/theme/tokens.ts`, готовые UI-киты не подключаем:
примитивы (`Button`, `Card`, `Pill`, `ProgressBar`, `Text`) написаны поверх
токенов. Хром монохромный, цвет — только у акцентов и статусов. Кнопки — pill,
высота 48. Сетка 8px.

Тёмная тема — инверсия ролей той же палитры; ни один цвет не задаётся в обход
токенов.

## Безопасность — что нельзя ломать

- **Премиум проверяется на сервере.** Политики RLS отдают `tier='premium'`
  только при активном entitlement. Скрывать премиум-контент на клиенте нельзя:
  тексты уедут в приложение вместе со списком и достанутся из трафика.
- **`entitlements` клиент не пишет никогда.** Единственный писатель —
  Edge Function `rc-webhook` под service role.
- **Захват слота атомарен.** `UPDATE ... WHERE status='open' RETURNING` — иначе
  два человека забронируют одно время.
- **Ключи только в окружении.** В git не попадает ни один токен.
