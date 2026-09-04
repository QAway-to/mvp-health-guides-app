import { Stack, useLocalSearchParams } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Columns } from '@/features/cards/Columns';
import { matchCards, type MatchLink } from '@/features/cards/matching';
import { useCard, useCards } from '@/features/cards/store';
import { useTheme } from '@/theme/theme';
import { RADIUS, SPACING } from '@/theme/tokens';
import { Card as Surface, EmptyState, Pill, Screen, SectionHeader, Text } from '@/ui';

export default function CardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { myCard } = useCards();
  const card = useCard(id);

  const match = useMemo(
    () => (card ? matchCards(myCard, card) : null),
    [myCard, card],
  );

  /**
   * Что подсветить в чужой карточке: их предложения, закрывающие мои запросы,
   * и их запросы, которые закрываю я. Подсветка идёт по строкам этой карточки,
   * поэтому из `theyGive` берётся `offer`, а из `theyWant` — `need`.
   */
  const matchedIds = useMemo(() => {
    if (match === null) return undefined;
    return new Set([
      ...match.theyGive.map((link) => link.offer.id),
      ...match.theyWant.map((link) => link.need.id),
    ]);
  }, [match]);

  if (!card) {
    return (
      <Screen>
        <Stack.Screen options={{ title: '' }} />
        <EmptyState title="Карточка не найдена" description="Похоже, её больше нет в базе." />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title: card.name }} />

      <View style={styles.head}>
        <Text variant="headingXl">{card.name}</Text>
        <Text variant="captionSm" tone="muted">
          {card.company ? `${card.role} · ${card.company}` : card.role} · {card.city}
        </Text>
        {match?.mutual ? <Pill label="Взаимное совпадение" tone="ink" /> : null}
      </View>

      <Text variant="body" tone="secondary" style={styles.about}>
        {card.about}
      </Text>

      <View style={styles.columns}>
        <Columns needs={card.needs} offers={card.offers} matchedIds={matchedIds} />
      </View>

      {match === null ? null : (
        <View style={styles.matches}>
          <SectionHeader
            title="Чем полезны друг другу"
            subtitle={match.mutual ? 'Сходится в обе стороны' : 'Пока в одну сторону'}
          />

          <LinkList
            heading="Вы получаете"
            empty="Их предложения не отвечают вашим запросам."
            links={match.theyGive}
            take={(link) => ({ mine: link.need.title, theirs: link.offer.title })}
          />

          <LinkList
            heading="Они получают"
            empty="Ваши предложения не отвечают их запросам."
            links={match.theyWant}
            take={(link) => ({ mine: link.offer.title, theirs: link.need.title })}
          />
        </View>
      )}
    </Screen>
  );
}

type LinkListProps = {
  heading: string;
  empty: string;
  links: readonly MatchLink[];
  /** Что считать «моей» и «их» стороной — зависит от направления совпадения. */
  take: (link: MatchLink) => { mine: string; theirs: string };
};

function LinkList({ heading, empty, links, take }: LinkListProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.linkBlock}>
      <Text variant="captionSm" uppercase tone="muted">
        {heading}
      </Text>

      {links.length === 0 ? (
        <Text variant="captionSm" tone="faint">
          {empty}
        </Text>
      ) : (
        links.map((link) => {
          const sides = take(link);
          return (
            <Surface key={`${link.need.id}-${link.offer.id}`} variant="outlined">
              <Text variant="bodyStrong">{sides.theirs}</Text>
              <Text variant="captionSm" tone="muted" style={styles.against}>
                под ваш запрос «{sides.mine}»
              </Text>
              <View style={styles.tags}>
                {link.shared.map((tag) => (
                  <View
                    key={tag}
                    style={[styles.tag, { backgroundColor: colors.accentSoft }]}
                  >
                    <Text variant="captionSm" tone="accent">
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </Surface>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { gap: SPACING.xs, alignItems: 'flex-start' },
  about: { marginTop: SPACING.md },
  columns: { marginTop: SPACING.xl },
  matches: { marginTop: SPACING.section },
  linkBlock: { gap: SPACING.sm, marginBottom: SPACING.xl },
  against: { marginTop: SPACING.xxs },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginTop: SPACING.sm },
  tag: {
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
  },
});
