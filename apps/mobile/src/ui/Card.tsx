import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/theme';
import { RADIUS, SPACING } from '@/theme/tokens';

type CardProps = {
  children: ReactNode;
  onPress?: () => void;
  /** filled — soft-cloud заливка, outlined — только волосяная рамка. */
  variant?: 'filled' | 'outlined';
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function Card({
  children,
  onPress,
  variant = 'filled',
  accessibilityLabel,
  style,
}: CardProps) {
  const { colors } = useTheme();

  const surface: ViewStyle = {
    backgroundColor: variant === 'filled' ? colors.surface : colors.canvas,
    borderColor: colors.hairline,
    borderWidth: variant === 'outlined' ? StyleSheet.hairlineWidth * 2 : 0,
  };

  if (!onPress) {
    return <View style={[styles.card, surface, style]}>{children}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => [styles.card, surface, pressed && { opacity: 0.72 }, style]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.md,
    gap: SPACING.sm,
    padding: SPACING.lg,
  },
});
