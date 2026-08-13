import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { GuideCard } from '@/features/guides/GuideCard';
import { useCategories, useGuides, useHasPremium, useProgress } from '@/features/guides/hooks';
import type { Guide } from '@/features/guides/types';
import { useTheme } from '@/theme/theme';
import { SPACING } from '@/theme/tokens';
import { EmptyState, Screen, SectionHeader, Text } from '@/ui';

export default function GuidesScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const categories = useCategories();
  const guides = useGuides();
  const progress = useProgress();
  const premium = useHasPremium();

  const guidesByCategory = useMemo(() => {
    const grouped = new Map<string, Guide[]>();
    for (const guide of guides.data ?? []) {
      const bucket = grouped.get(guide.category_id) ?? [];
      bucket.push(guide);
      grouped.set(guide.category_id, bucket);
    }
    return grouped;
  }, [guides.data]);

  const completed = useMemo(
    () => new Set((progress.data ?? []).filter((row) => row.status === 'completed').map((row) => row.guide_id)),
    [progress.data],
  );

  if (guides.isPending || categories.isPending) {
    return (
      <Screen scroll={false} style={{ justifyContent: 'center' }}>
        <ActivityIndicator color={colors.ink} />
      </Screen>
    );
  }

  if (guides.isError || categories.isError) {
    return (
      <Screen>
        <SectionHeader title="Гайды" />
        <EmptyState
          title="Не удалось загрузить"
          description="Проверьте соединение — гайды появятся, как только связь вернётся."
          actionLabel="Повторить"
          onAction={() => {
            guides.refetch();
            categories.refetch();
          }}
        />
      </Screen>
    );
  }

  const hasPremium = premium.data === true;

  return (
    <Screen>
      <SectionHeader title="Гайды" subtitle="От первых шагов до конца тренировки" />

      <View style={{ gap: SPACING.section }}>
        {(categories.data ?? []).map((category) => {
          const items = guidesByCategory.get(category.id) ?? [];
          if (items.length === 0) {
            return null;
          }

          return (
            <View key={category.id} style={{ gap: SPACING.md }}>
              <View style={{ gap: SPACING.xxs }}>
                <Text variant="headingLg" uppercase>
                  {category.title}
                </Text>
                <Text variant="caption" tone="muted">
                  {category.subtitle}
                </Text>
              </View>

              {items.map((guide) => (
                <GuideCard
                  key={guide.id}
                  guide={guide}
                  isLocked={guide.tier === 'premium' && !hasPremium}
                  isCompleted={completed.has(guide.id)}
                  onPress={() => router.push(`/guide/${guide.slug}`)}
                />
              ))}
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
