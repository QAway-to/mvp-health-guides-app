import { StyleSheet, TextInput, View } from 'react-native';

import { useTheme } from '@/theme/theme';
import { RADIUS, SPACING, TYPE } from '@/theme/tokens';
import { Text } from './Text';

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  /** Многострочное поле — для описаний и условий. */
  multiline?: boolean;
};

/** Поле ввода в том же монохроме, что и остальной набор. */
export function Field({ label, value, onChangeText, placeholder, multiline = false }: FieldProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.field}>
      <Text variant="captionSm" uppercase tone="muted">
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkFaint}
        multiline={multiline}
        style={[
          TYPE.body,
          styles.input,
          multiline && styles.multiline,
          { color: colors.ink, backgroundColor: colors.surface, borderColor: colors.hairline },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: SPACING.xs },
  input: {
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  multiline: { minHeight: 84, textAlignVertical: 'top' },
});
