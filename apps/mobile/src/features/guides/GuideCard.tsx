import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

import { useTheme } from '@/theme/theme';
import { SPACING } from '@/theme/tokens';
import { Card, Pill, Text } from '@/ui';
import type { Guide } from './types';

type GuideCardProps = {
  guide: Guide;
  /** Платный гайд без подписки: карточку видно, содержимое — нет. */
  isLocked: boolean;
  isCompleted: boolean;
  onPress: () => void;
};

export function GuideCard({ guide, isLocked, isCompleted, onPress }: GuideCardProps) {
  const { colors } = useTheme();

  return (
    <Card
      variant="outlined"
      onPress={onPress}
      accessibilityLabel={
        isLocked ? `${guide.title}. Доступно по подписке` : guide.title
      }
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md }}>
        <View style={{ flex: 1, gap: SPACING.xs }}>
          <Text variant="headingMd">{guide.title}</Text>
          <Text variant="caption" tone="muted">
            {guide.summary}
          </Text>
        </View>
        {isLocked ? (
          <Ionicons name="lock-closed" size={18} color={colors.inkFaint} />
        ) : isCompleted ? (
          <Ionicons name="checkmark-circle" size={20} color={colors.success} />
        ) : null}
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.xs }}>
        <Pill label={`${guide.duration_min} мин`} />
        {guide.level === 'beginner' ? <Pill label="с нуля" /> : null}
        {isLocked ? <Pill label="по подписке" tone="accent" /> : null}
        {isCompleted ? <Pill label="пройдено" tone="success" /> : null}
      </View>
    </Card>
  );
}
