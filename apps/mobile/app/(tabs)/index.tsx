import { EmptyState, Screen, SectionHeader } from '@/ui';

/**
 * «Сегодня» — практика дня из 4-недельной программы.
 * Данные подключаются на этапе 3, здесь пока каркас и пустое состояние.
 */
export default function TodayScreen() {
  return (
    <Screen>
      <SectionHeader title="Сегодня" subtitle="Практика дня и прогресс недели" />
      <EmptyState
        title="Программа ещё не началась"
        description="Пройдите первый гайд — и здесь появится план на каждый день."
      />
    </Screen>
  );
}
