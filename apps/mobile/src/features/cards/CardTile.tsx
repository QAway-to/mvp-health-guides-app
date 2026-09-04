import { StyleSheet, View } from 'react-native';

import { SPACING } from '@/theme/tokens';
import { Card as Surface, Pill, Text } from '@/ui';
import { KIND_SHORT } from './catalog';
import type { Card } from './types';

type CardTileProps = {
  card: Card;
  /** Сколько строк сходится с моей карточкой. Ноль — плашки нет. */
  matchCount?: number;
  mutual?: boolean;
  onPress: () => void;
};

/**
 * Плитка в ленте.
 *
 * Колонок здесь нет — на список их не хватает по ширине, да и не нужно.
 * Вместо содержимого показываем, какими видами ресурса человек оперирует:
 * этого достаточно, чтобы решить, открывать ли карточку целиком.
 */
export function CardTile({ card, matchCount = 0, mutual = false, onPress }: CardTileProps) {
  const needKinds = [...new Set(card.needs.map((entry) => entry.kind))];
  const offerKinds = [...new Set(card.offers.map((entry) => entry.kind))];

  return (
    <Surface onPress={onPress} accessibilityLabel={`Карточка: ${card.name}`}>
      <View style={styles.head}>
        <View style={styles.who}>
          <Text variant="headingMd">{card.name}</Text>
          <Text variant="captionSm" tone="muted">
            {card.company ? `${card.role} · ${card.company}` : card.role}
          </Text>
        </View>

        {matchCount > 0 ? (
          <Pill
            label={mutual ? `Взаимно · ${matchCount}` : `Совпало · ${matchCount}`}
            tone={mutual ? 'ink' : 'accent'}
          />
        ) : null}
      </View>

      <Text variant="captionSm" tone="secondary" style={styles.about}>
        {card.about}
      </Text>

      <View style={styles.kinds}>
        <View style={styles.kindsColumn}>
          <Text variant="captionSm" tone="faint" uppercase>
            Ищет
          </Text>
          <Text variant="captionSm" tone="secondary">
            {needKinds.map((kind) => KIND_SHORT[kind]).join(' · ') || '—'}
          </Text>
        </View>

        <View style={styles.kindsColumn}>
          <Text variant="captionSm" tone="faint" uppercase>
            Даёт
          </Text>
          <Text variant="captionSm" tone="secondary">
            {offerKinds.map((kind) => KIND_SHORT[kind]).join(' · ') || '—'}
          </Text>
        </View>
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  who: { flex: 1, gap: SPACING.xxs },
  about: { marginTop: SPACING.sm },
  kinds: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  kindsColumn: { flex: 1, flexBasis: 0, gap: SPACING.xxs },
});
