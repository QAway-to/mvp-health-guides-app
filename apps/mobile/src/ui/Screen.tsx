import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/theme/theme';
import { SPACING } from '@/theme/tokens';

type ScreenProps = {
  children: ReactNode;
  scroll?: boolean;
  /** Нижний отступ под таб-бар или закреплённую кнопку. */
  footerSpace?: number;
  style?: ViewStyle;
};

export function Screen({ children, scroll = true, footerSpace = 0, style }: ScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const padding = {
    paddingHorizontal: SPACING.xl,
    paddingBottom: insets.bottom + SPACING.xl + footerSpace,
  };

  if (!scroll) {
    return (
      <View style={[styles.root, { backgroundColor: colors.canvas }, padding, style]}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: colors.canvas }]}
      contentContainerStyle={[padding, style]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
