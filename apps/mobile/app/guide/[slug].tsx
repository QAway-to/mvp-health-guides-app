import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useSession } from '@/features/auth/session';
import { trackEvent } from '@/features/guides/api';
import { useGuide, useHasPremium, useProgress } from '@/features/guides/hooks';
import { useTheme } from '@/theme/theme';
import { SPACING } from '@/theme/tokens';
import { Button, Card, EmptyState, Pill, Screen, Text } from '@/ui';

export default function GuideScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { userId } = useSession();

  const guide = useGuide(slug ?? '');
  const premium = useHasPremium();
  const progress = useProgress();

  useEffect(() => {
    if (guide.data) {
      trackEvent(userId, 'guide_opened', { slug: guide.data.slug, tier: guide.data.tier });
    }
  }, [guide.data, userId]);

  if (guide.isPending) {
    return (
      <Screen scroll={false} style={{ justifyContent: 'center' }}>
        <Stack.Screen options={{ title: '' }} />
        <ActivityIndicator color={colors.ink} />
      </Screen>
    );
  }

  if (guide.isError || !guide.data) {
    return (
      <Screen>
        <Stack.Screen options={{ title: '' }} />
        <EmptyState
          title="Гайд не открылся"
          description="Проверьте соединение и попробуйте ещё раз."
          actionLabel="Повторить"
          onAction={() => guide.refetch()}
        />
      </Screen>
    );
  }

  const data = guide.data;
  // Шаги закрыты политикой RLS, а не спрятаны на клиенте: у платного гайда без
  // подписки их просто нет в ответе.
  const isLocked = data.steps.length === 0 && data.tier === 'premium';
  const record = (progress.data ?? []).find((row) => row.guide_id === data.id);
  const isCompleted = record?.status === 'completed';

  return (
    <Screen footerSpace={SPACING.section}>
      <Stack.Screen options={{ title: '' }} />

      <View style={{ gap: SPACING.md, paddingTop: SPACING.sm, paddingBottom: SPACING.xl }}>
        <Text variant="displayLg" uppercase>
          {data.title}
        </Text>
        <Text variant="body" tone="secondary">
          {data.summary}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
          <Pill label={`${data.duration_min} мин`} />
          {data.steps.length > 0 ? <Pill label={`${data.steps.length} шагов`} /> : null}
          {isCompleted ? <Pill label="пройдено" tone="success" /> : null}
        </View>
      </View>

      {data.contraindications ? (
        <Card variant="outlined" style={{ marginBottom: SPACING.xl }}>
          <View style={{ flexDirection: 'row', gap: SPACING.sm, alignItems: 'center' }}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.accent} />
            <Text variant="captionSm" tone="accent" uppercase>
              Противопоказания
            </Text>
          </View>
          <Text variant="caption" tone="secondary">
            {data.contraindications}
          </Text>
        </Card>
      ) : null}

      {isLocked ? (
        <LockedBody
          onPress={() => {
            trackEvent(userId, 'paywall_shown', { from: 'guide', slug: data.slug });
            router.push('/paywall');
          }}
        />
      ) : (
        <View style={{ gap: SPACING.md }}>
          <Text variant="captionSm" tone="muted" uppercase>
            Что будем делать
          </Text>

          {data.steps.map((step, index) => (
            <View key={step.id} style={{ flexDirection: 'row', gap: SPACING.md }}>
              <Text variant="headingMd" tone="faint" style={{ width: 24 }}>
                {index + 1}
              </Text>
              <View style={{ flex: 1, gap: SPACING.xxs }}>
                <Text variant="bodyStrong">{step.title}</Text>
                {step.duration_sec ? (
                  <Text variant="captionSm" tone="muted">
                    {Math.round(step.duration_sec / 60) || 1} мин
                  </Text>
                ) : null}
              </View>
            </View>
          ))}

          <Button
            label={isCompleted ? 'Пройти ещё раз' : 'Начать'}
            size="lg"
            fullWidth
            style={{ marginTop: SPACING.lg }}
            onPress={() => router.push(`/session/${data.slug}`)}
          />
        </View>
      )}
    </Screen>
  );
}

function LockedBody({ onPress }: { onPress: () => void }) {
  return (
    <Card>
      <Text variant="headingMd">Этот гайд входит в подписку</Text>
      <Text variant="body" tone="muted">
        Открывается вместе с остальными практиками Федерации и записью к тренеру.
      </Text>
      <Button label="Что входит в подписку" fullWidth style={{ marginTop: SPACING.sm }} onPress={onPress} />
    </Card>
  );
}
