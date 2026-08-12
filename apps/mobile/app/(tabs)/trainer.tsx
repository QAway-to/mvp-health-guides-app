import { EmptyState, Screen, SectionHeader } from '@/ui';

/** Запись к тренеру: календарь слотов и мои записи. Этап 5. */
export default function TrainerScreen() {
  return (
    <Screen>
      <SectionHeader title="Тренер" subtitle="Разбор техники один на один" />
      <EmptyState
        title="Запись скоро откроется"
        description="Здесь появится календарь свободных слотов и ваши записи."
      />
    </Screen>
  );
}
