import { Stack } from 'expo-router';

import { SPACING } from '@/theme/tokens';
import { Card, Screen, Text } from '@/ui';

/**
 * Экран подписки. Наполняется на этапе 4 вместе с RevenueCat: до тех пор
 * никаких цен и состава — бот держит то же правило, чтобы не называть живым
 * людям выдуманные цифры.
 */
export default function PaywallScreen() {
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Подписка', presentation: 'modal' }} />

      <Card style={{ marginTop: SPACING.xl }}>
        <Text variant="headingLg">Подписка скоро откроется</Text>
        <Text variant="body" tone="muted">
          Условия и стоимость появятся здесь, когда оплата будет подключена. Пока бесплатные
          гайды доступны целиком — их хватает, чтобы провести первую тренировку.
        </Text>
      </Card>
    </Screen>
  );
}
