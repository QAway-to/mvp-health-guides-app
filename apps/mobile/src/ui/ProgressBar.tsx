import { StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/theme';
import { RADIUS } from '@/theme/tokens';

/** Полоса прогресса шагов сессии. `value` — доля от 0 до 1. */
export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const { colors } = useTheme();
  const clamped = Number.isFinite(value) ? Math.min(Math.max(value, 0), 1) : 0;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
      style={[styles.track, { backgroundColor: colors.hairline }]}
    >
      <View style={[styles.fill, { backgroundColor: colors.ink, width: `${clamped * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: RADIUS.full,
    height: 4,
    overflow: 'hidden',
    width: '100%',
  },
  fill: { height: '100%' },
});
