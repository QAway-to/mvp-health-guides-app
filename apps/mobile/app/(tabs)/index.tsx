import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { CardTile } from '@/features/cards/CardTile';
import { findMatches } from '@/features/cards/matching';
import { useCards } from '@/features/cards/store';
import { useTheme } from '@/theme/theme';
import { RADIUS, SPACING } from '@/theme/tokens';
import { EmptyState, Screen, SectionHeader, Text } from '@/ui';

export default function FeedScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { myCard, cards } = useCards();
  const [onlyMatches, setOnlyMatches] = useState(false);

  const matches = useMemo(() => findMatches(myCard, cards), [myCard, cards]);

  const byId = useMemo(
    () => new Map(matches.map((match) => [match.card.id, match])),
    [matches],
  );

  // Совпавшие сверху, в порядке силы совпадения; остальные — как лежат.
  // Лента без такой сортировки заставляет искать глазами то, ради чего
  // человек её открыл.
  const ordered = useMemo(() => {
    const matched = matches.map((match) => match.card);
    const rest = cards.filter((card) => !byId.has(card.id));
    return onlyMatches ? matched : [...matched, ...rest];
  }, [matches, cards, byId, onlyMatches]);

  return (
    <Screen>
      <SectionHeader
        title="Лента"
        subtitle={`${cards.length} карточек · совпадений ${matches.length}`}
      />

      <View style={styles.filter}>
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: onlyMatches }}
          accessibilityLabel="Показывать только совпадения"
          onPress={() => setOnlyMatches((value) => !value)}
          style={[
            styles.toggle,
            {
              backgroundColor: onlyMatches ? colors.ink : colors.surface,
              borderColor: onlyMatches ? colors.ink : colors.hairline,
            },
          ]}
        >
          <Text variant="captionSm" tone={onlyMatches ? 'onInk' : 'secondary'} uppercase>
            Только совпадения
          </Text>
        </Pressable>
      </View>

      {ordered.length === 0 ? (
        <EmptyState
          title="Совпадений пока нет"
          description="Добавьте требования и предложения в свою карточку — лента подберёт встречные."
          actionLabel="Открыть мою карточку"
          onAction={() => router.push('/profile')}
        />
      ) : (
        <View style={styles.list}>
          {ordered.map((card) => {
            const match = byId.get(card.id);
            return (
              <CardTile
                key={card.id}
                card={card}
                matchCount={match ? match.theyGive.length + match.theyWant.length : 0}
                mutual={match?.mutual ?? false}
                onPress={() => router.push({ pathname: '/card/[id]', params: { id: card.id } })}
              />
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  filter: { flexDirection: 'row', marginBottom: SPACING.lg },
  toggle: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  list: { gap: SPACING.md },
});
