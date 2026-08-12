import { ActivityIndicator, Pressable, StyleSheet, View, type ViewStyle } from 'react-native';

import { useTheme } from '@/theme/theme';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'md' | 'lg';

export type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  accessibilityHint?: string;
};

/** Nike-кнопка: pill, высота 48, ink на белом. */
export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  accessibilityHint,
}: ButtonProps) {
  const { colors } = useTheme();
  const isInactive = disabled || loading;

  const background = {
    primary: colors.ink,
    secondary: colors.surface,
    outline: 'transparent',
    ghost: 'transparent',
  }[variant];

  const tone = variant === 'primary' ? 'onInk' : 'default';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isInactive, busy: loading }}
      accessibilityHint={accessibilityHint}
      disabled={isInactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        {
          backgroundColor: background,
          borderColor: variant === 'outline' ? colors.hairlineStrong : 'transparent',
          borderWidth: variant === 'outline' ? StyleSheet.hairlineWidth * 2 : 0,
        },
        fullWidth && styles.fullWidth,
        // Nike-хром не имеет hover-состояний на мобильном: гасим прозрачностью.
        pressed && { opacity: 0.72 },
        isInactive && { opacity: 0.4 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.onInk : colors.ink} />
      ) : (
        <View style={styles.content}>
          <Text variant="button" tone={tone}>
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    borderRadius: RADIUS.full,
    justifyContent: 'center',
  },
  md: { height: 48, paddingHorizontal: SPACING.xl + SPACING.sm },
  lg: { height: 56, paddingHorizontal: SPACING.xxl },
  fullWidth: { alignSelf: 'stretch' },
  content: { alignItems: 'center', flexDirection: 'row', gap: SPACING.sm },
});
