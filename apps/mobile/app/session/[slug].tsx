import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { useSession } from '@/features/auth/session';
import { trackEvent } from '@/features/guides/api';
import { useGuide, useSaveProgress } from '@/features/guides/hooks';
import { StepTimer } from '@/features/guides/StepTimer';
import { useTheme } from '@/theme/theme';
import { SPACING } from '@/theme/tokens';
import { Button, EmptyState, ProgressBar, Screen, Text } from '@/ui';

/**
 * Ведомая сессия: гайд проходится шаг за шагом, а не читается статьёй.
 * Ради этого экрана всё и затевалось — человек должен выйти и сделать.
 */
export default function SessionScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { userId } = useSession();

  const guide = useGuide(slug ?? '');
  const saveProgress = useSaveProgress();

  const [stepIndex, setStepIndex] = useState(0);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const steps = useMemo(() => guide.data?.steps ?? [], [guide.data]);
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  const persist = useCallback(
    (upto: number, isCompleted: boolean) => {
      if (!guide.data || !userId) {
        return;
      }
      saveProgress.mutate({
        guideId: guide.data.id,
        completedSteps: Array.from({ length: upto + 1 }, (_, i) => i),
        isCompleted,
      });
    },
    [guide.data, saveProgress, userId],
  );

  const goNext = useCallback(() => {
    if (!guide.data) {
      return;
    }

    if (isLast) {
      persist(stepIndex, true);
      trackEvent(userId, 'guide_completed', { slug: guide.data.slug });
      router.replace(`/guide/${guide.data.slug}`);
      return;
    }

    persist(stepIndex, false);
    setStepIndex((index) => index + 1);
  }, [guide.data, isLast, persist, router, stepIndex, userId]);

  if (guide.isPending) {
    return (
      <Screen scroll={false} style={{ justifyContent: 'center' }}>
        <Stack.Screen options={{ title: '' }} />
        <ActivityIndicator color={colors.ink} />
      </Screen>
    );
  }

  if (!guide.data || steps.length === 0 || !step) {
    return (
      <Screen>
        <Stack.Screen options={{ title: '' }} />
        <EmptyState
          title="Сессия недоступна"
          description="Гайд не загрузился или закрыт подпиской."
          actionLabel="Назад"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  return (
    <Screen footerSpace={SPACING.xl}>
      <Stack.Screen options={{ title: guide.data.title, headerBackTitle: 'Выйти' }} />

      <View style={{ gap: SPACING.sm, paddingTop: SPACING.md, paddingBottom: SPACING.xl }}>
        <ProgressBar value={(stepIndex + 1) / steps.length} label="Прогресс сессии" />
        <Text variant="captionSm" tone="muted" uppercase>
          Шаг {stepIndex + 1} из {steps.length}
        </Text>
      </View>

      <View style={{ gap: SPACING.lg }}>
        <Text variant="headingXl">{step.title}</Text>
        <Text variant="body" tone="secondary">
          {step.body}
        </Text>

        {step.duration_sec ? <StepTimer durationSec={step.duration_sec} /> : null}

        {step.checklist.length > 0 ? (
          <View style={{ gap: SPACING.sm }}>
            {step.checklist.map((item) => {
              const key = `${step.id}:${item}`;
              const isChecked = checked[key] === true;

              return (
                <Pressable
                  key={key}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isChecked }}
                  onPress={() => setChecked((prev) => ({ ...prev, [key]: !prev[key] }))}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.md }}
                >
                  <Ionicons
                    name={isChecked ? 'checkbox' : 'square-outline'}
                    size={22}
                    color={isChecked ? colors.ink : colors.inkFaint}
                  />
                  <Text variant="body" tone={isChecked ? 'default' : 'muted'}>
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.section }}>
        {stepIndex > 0 ? (
          <Button label="Назад" variant="outline" onPress={() => setStepIndex((i) => i - 1)} />
        ) : null}
        <Button
          label={isLast ? 'Завершить' : 'Дальше'}
          size="lg"
          style={{ flex: 1 }}
          onPress={goNext}
        />
      </View>
    </Screen>
  );
}
