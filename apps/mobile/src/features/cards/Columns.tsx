import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/theme/theme';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Text } from '@/ui';
import { KIND_META } from './catalog';
import type { Entry } from './types';

type EntryRowProps = {
  entry: Entry;
  side: 'need' | 'offer';
  /** Подсветить: эта строка участвует в совпадении. */
  matched?: boolean;
  onRemove?: () => void;
};

function EntryRow({ entry, side, matched = false, onRemove }: EntryRowProps) {
  const { colors } = useTheme();
  const meta = KIND_META[entry.kind];
  const label = side === 'need' ? meta.needLabel : meta.offerLabel;

  return (
    <View
      style={[
        styles.entry,
        {
          backgroundColor: matched ? colors.accentSoft : colors.surface,
          borderColor: matched ? colors.accent : 'transparent',
        },
      ]}
    >
      <View style={styles.entryHead}>
        <Ionicons
          name={meta.icon}
          size={13}
          color={matched ? colors.accent : colors.inkMuted}
          style={styles.icon}
        />
        <Text variant="captionSm" tone={matched ? 'accent' : 'muted'} style={styles.kindLabel}>
          {label}
        </Text>
      </View>

      <Text variant="bodyStrong" style={styles.title}>
        {entry.title}
      </Text>

      <Text variant="captionSm" tone="muted">
        {entry.detail}
      </Text>

      {onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Убрать: ${entry.title}`}
          onPress={onRemove}
          hitSlop={8}
          style={styles.remove}
        >
          <Ionicons name="close" size={15} color={colors.inkMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

type ColumnsProps = {
  needs: readonly Entry[];
  offers: readonly Entry[];
  /** Идентификаторы строк, попавших в совпадение, — подсвечиваются. */
  matchedIds?: ReadonlySet<string>;
  onRemoveNeed?: (entryId: string) => void;
  onRemoveOffer?: (entryId: string) => void;
};

/**
 * Карточка как две колонки: слева что ищут, справа что дают.
 *
 * Колонки стоят рядом, а не одна под другой, и это принципиально. Ценность
 * карточки в сопоставлении: человек читает её взглядом поперёк, проверяя, чем
 * его сторона отвечает на чужую. Список из двух разделов подряд эту связь
 * теряет — приходится листать и держать первую половину в голове.
 */
export function Columns({
  needs,
  offers,
  matchedIds,
  onRemoveNeed,
  onRemoveOffer,
}: ColumnsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.columns}>
      <View style={styles.column}>
        <View style={[styles.columnHead, { borderBottomColor: colors.ink }]}>
          <Text variant="captionSm" uppercase>
            Требования
          </Text>
        </View>

        {needs.length === 0 ? (
          <Text variant="captionSm" tone="faint">
            Пока ничего не ищет
          </Text>
        ) : (
          needs.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              side="need"
              matched={matchedIds?.has(entry.id) ?? false}
              onRemove={onRemoveNeed ? () => onRemoveNeed(entry.id) : undefined}
            />
          ))
        )}
      </View>

      <View style={styles.column}>
        <View style={[styles.columnHead, { borderBottomColor: colors.ink }]}>
          <Text variant="captionSm" uppercase>
            Предложения
          </Text>
        </View>

        {offers.length === 0 ? (
          <Text variant="captionSm" tone="faint">
            Пока ничего не предлагает
          </Text>
        ) : (
          offers.map((entry) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              side="offer"
              matched={matchedIds?.has(entry.id) ?? false}
              onRemove={onRemoveOffer ? () => onRemoveOffer(entry.id) : undefined}
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  columns: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  // Обе колонки одной ширины независимо от наполнения: разъехавшаяся сетка
  // ломает чтение поперёк, ради которого колонки и стоят рядом.
  column: {
    flex: 1,
    flexBasis: 0,
    gap: SPACING.sm,
  },
  columnHead: {
    borderBottomWidth: 2,
    paddingBottom: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  entry: {
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    padding: SPACING.md,
    gap: SPACING.xxs,
  },
  entryHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  icon: { marginTop: 1 },
  kindLabel: { flexShrink: 1 },
  title: { marginTop: SPACING.xxs },
  remove: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
  },
});
