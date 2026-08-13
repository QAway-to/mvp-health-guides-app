import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';

import { useHasPremium } from '@/features/guides/hooks';
import { useToday } from '@/features/program/useToday';
import { useTheme } from '@/theme/theme';
import { SPACING } from '@/theme/tokens';
import { Button, Card, EmptyState, Pill, ProgressBar, Screen, SectionHeader, Text } from '@/ui';

export default function TodayScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const today = useToday();
  const premium = useHasPremium();

  if (today.isPending) {
    return (
      <Screen scroll={false} style={{ justifyContent: 'center' }}>
        <ActivityIndicator color={colors.ink} />
      </Screen>
    );
  }

  if (today.isError) {
    return (
      <Screen>
        <SectionHeader title="Сегодня" />
        <EmptyState
          title="Программа не загрузилась"
          description="Проверьте соединение — план появится, как только связь вернётся."
        />
      </Screen>
    );
  }

  if (!today.today) {
    return (
      <Screen>
        <SectionHeader title="Готово" subtitle="Программа пройдена целиком" />
        <Card>
          <Text variant="headingMd">Норма остаётся с вами</Text>
          <Text variant="body" tone="muted">
            1,5–2 км утром и вечером. Возвращайтесь к любому гайду, когда захотите освежить технику.
          </Text>
          <Button
            label="Открыть гайды"
            fullWidth
            style={{ marginTop: SPACING.sm }}
            onPress={() => router.push('/guides')}
          />
        </Card>
      </Screen>
    );
  }

  const { day, guide } = today.today;
  const isLocked = guide.tier === 'premium' && premium.data !== true;

  return (
    <Screen>
      <SectionHeader
        title="Сегодня"
        subtitle={`Неделя ${day.week}, день ${day.day} — ${today.week.done} из ${today.week.total} закрыто`}
      />

      <View style={{ gap: SPACING.xl }}>
        <View style={{ gap: SPACING.sm }}>
          <ProgressBar value={today.week.done / today.week.total} label="Прогресс недели" />
          <Text variant="captionSm" tone="muted" uppercase>
            Всего пройдено {today.completedTotal} из {today.programLength}
          </Text>
        </View>

        <Card>
          <Text variant="captionSm" tone="muted" uppercase>
            Практика дня
          </Text>
          <Text variant="headingLg">{guide.title}</Text>
          <Text variant="body" tone="muted">
            {day.note ?? guide.summary}
          </Text>

          <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.xs }}>
            <Pill label={`${guide.duration_min} мин`} />
            {isLocked ? <Pill label="по подписке" tone="accent" /> : null}
          </View>

          <Button
            label={isLocked ? 'Что входит в подписку' : 'Начать'}
            size="lg"
            fullWidth
            style={{ marginTop: SPACING.md }}
            onPress={() =>
              isLocked ? router.push('/paywall') : router.push(`/session/${guide.slug}`)
            }
          />
        </Card>

        <Button
          label="Открыть гайд целиком"
          variant="outline"
          fullWidth
          onPress={() => router.push(`/guide/${guide.slug}`)}
        />
      </View>
    </Screen>
  );
}
