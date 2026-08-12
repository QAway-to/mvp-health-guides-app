import { View } from 'react-native';

import { SPACING } from '@/theme/tokens';
import { Button } from './Button';
import { Text } from './Text';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={{ alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.section }}>
      <Text variant="headingLg" center>
        {title}
      </Text>
      <Text variant="body" tone="muted" center>
        {description}
      </Text>
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={{ marginTop: SPACING.sm }} />
      ) : null}
    </View>
  );
}
