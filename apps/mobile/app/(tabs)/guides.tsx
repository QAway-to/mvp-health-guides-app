import { EmptyState, Screen, SectionHeader } from '@/ui';

/** Библиотека гайдов по категориям. Наполняется на этапе 3. */
export default function GuidesScreen() {
  return (
    <Screen>
      <SectionHeader title="Гайды" subtitle="От первых шагов до конца тренировки" />
      <EmptyState
        title="Гайды загружаются"
        description="Библиотека появится, когда подключим контент из базы знаний Федерации."
      />
    </Screen>
  );
}
