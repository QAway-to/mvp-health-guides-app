import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { useTheme } from '@/theme/theme';
import type { TypeToken } from '@/theme/tokens';

type Tone = 'default' | 'secondary' | 'muted' | 'faint' | 'accent' | 'success' | 'onInk';

export type TextProps = RNTextProps & {
  variant?: TypeToken;
  tone?: Tone;
  uppercase?: boolean;
  center?: boolean;
};

export function Text({
  variant = 'body',
  tone = 'default',
  uppercase = false,
  center = false,
  style,
  ...rest
}: TextProps) {
  const { colors, type } = useTheme();

  const toneColor = {
    default: colors.ink,
    secondary: colors.inkSecondary,
    muted: colors.inkMuted,
    faint: colors.inkFaint,
    accent: colors.accent,
    success: colors.success,
    onInk: colors.onInk,
  }[tone];

  return (
    <RNText
      style={[
        type[variant],
        { color: toneColor },
        uppercase && { textTransform: 'uppercase' as const },
        center && { textAlign: 'center' as const },
        style,
      ]}
      {...rest}
    />
  );
}
