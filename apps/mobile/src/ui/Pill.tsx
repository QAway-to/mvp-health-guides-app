import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/theme';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Text } from './Text';

type PillTone = 'neutral' | 'ink' | 'accent' | 'success';

/** Серая или чёрная таблетка-тег: тир гайда, категория, длительность. */
export function Pill({ label, tone = 'neutral' }: { label: string; tone?: PillTone }) {
  const { colors } = useTheme();

  const background = {
    neutral: colors.surface,
    ink: colors.ink,
    accent: colors.accentSoft,
    success: colors.surface,
  }[tone];

  const textTone = {
    neutral: 'secondary',
    ink: 'onInk',
    accent: 'accent',
    success: 'success',
  }[tone] as 'secondary' | 'onInk' | 'accent' | 'success';

  return (
    <View style={[styles.pill, { backgroundColor: background }]}>
      <Text variant="captionSm" tone={textTone} uppercase>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
  },
});
