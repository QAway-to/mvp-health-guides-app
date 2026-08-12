import { View } from 'react-native';

import { SPACING } from '@/theme/tokens';
import { Card, Screen, SectionHeader, Text } from '@/ui';

/** Профиль: подписка, прогресс, напоминания, дисклеймер. Наполняется на этапах 4 и 6. */
export default function ProfileScreen() {
  return (
    <Screen>
      <SectionHeader title="Профиль" subtitle="Подписка и настройки" />

      <View style={{ gap: SPACING.md }}>
        <Card>
          <Text variant="headingMd">Подписка</Text>
          <Text variant="body" tone="muted">
            Управление подпиской появится после подключения оплаты.
          </Text>
        </Card>

        <Card variant="outlined">
          <Text variant="captionSm" tone="muted" uppercase>
            Важно
          </Text>
          <Text variant="caption" tone="secondary">
            Материалы Федерации Здоровья — это практики, а не медицинские рекомендации. При острых
            болях в суставах и позвоночнике, после недавних операций и при обострении хронических
            заболеваний сначала проконсультируйтесь с врачом.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}
