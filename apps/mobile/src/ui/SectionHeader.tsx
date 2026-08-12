import { View } from 'react-native';

import { SPACING } from '@/theme/tokens';
import { Text } from './Text';

/**
 * Заголовок экрана в духе Nike: крупный конденсированный uppercase-лозунг,
 * под ним обычным текстом — пояснение.
 */
export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={{ gap: SPACING.sm, paddingTop: SPACING.xl, paddingBottom: SPACING.xl }}>
      <Text variant="displayLg" uppercase>
        {title}
      </Text>
      {subtitle ? (
        <Text variant="body" tone="muted">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
