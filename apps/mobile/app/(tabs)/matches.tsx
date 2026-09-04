import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { findMatches, type Match } from '@/features/cards/matching';
import { useCards } from '@/features/cards/store';
import { SPACING } from '@/theme/tokens';
import { Card as Surface, EmptyState, Pill, Screen, SectionHeader, Text } from '@/ui';

export default function MatchesScreen() {
  const router = useRouter();
  const { myCard, cards } = useCards();

  const matches = useMemo(() => findMatches(myCard, cards), [myCard, cards]);
  const mutual = matches.filter((match) => match.mutual);
  const oneWay = matches.filter((match) => !match.mutual);

  if (matches.length === 0) {
    return (
      <Screen>
        <SectionHeader title="Совпадения" />
        <EmptyState
          title="Пока пусто"
          description="Совпадение появляется, когда ваш запрос встречается с чужим предложением. Добавьте строки в свою карточку."
          actionLabel="Моя карточка"
          onAction={() => router.push('/profile')}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader
        title="Совпадения"
        subtitle={`Взаимных ${mutual.length} · односторонних ${oneWay.length}`}
      />

      {mutual.length > 0 ? (
        <View style={styles.group}>
          <Text variant="captionSm" uppercase tone="muted">
            Взаимные
          </Text>
          {mutual.map((match) => (
            <MatchTile
              key={match.card.id}
              match={match}
              onPress={() => router.push({ pathname: '/card/[id]', params: { id: match.card.id } })}
            />
          ))}
        </View>
      ) : null}

      {oneWay.length > 0 ? (
        <View style={styles.group}>
          <Text variant="captionSm" uppercase tone="muted">
            В одну сторону
          </Text>
          {oneWay.map((match) => (
            <MatchTile
              key={match.card.id}
              match={match}
              onPress={() => router.push({ pathname: '/card/[id]', params: { id: match.card.id } })}
            />
          ))}
        </View>
      ) : null}
    </Screen>
  );
}

/**
 * Плитка совпадения.
 *
 * Показывает не «совпало 3», а что именно совпало: первую строку с каждой
 * стороны. Число ничего не говорит о том, стоит ли писать человеку, а
 * «помещение под встречи ← залы кофеен вечером» говорит сразу.
 */
function MatchTile({ match, onPress }: { match: Match; onPress: () => void }) {
  const give = match.theyGive[0];
  const want = match.theyWant[0];

  return (
    <Surface onPress={onPress} accessibilityLabel={`Совпадение с ${match.card.name}`}>
      <View style={styles.head}>
        <View style={styles.who}>
          <Text variant="headingMd">{match.card.name}</Text>
          <Text variant="captionSm" tone="muted">
            {match.card.company ? `${match.card.role} · ${match.card.company}` : match.card.role}
          </Text>
        </View>
        <Pill
          label={match.mutual ? 'Взаимно' : 'В одну сторону'}
          tone={match.mutual ? 'ink' : 'neutral'}
        />
      </View>

      {give ? (
        <View style={styles.line}>
          <Text variant="captionSm" tone="faint" uppercase>
            Вы получаете
          </Text>
          <Text variant="bodyStrong">{give.offer.title}</Text>
          <Text variant="captionSm" tone="muted">
            под ваш запрос «{give.need.title}»
          </Text>
        </View>
      ) : null}

      {want ? (
        <View style={styles.line}>
          <Text variant="captionSm" tone="faint" uppercase>
            Они получают
          </Text>
          <Text variant="bodyStrong">{want.need.title}</Text>
          <Text variant="captionSm" tone="muted">
            закрывается вашим «{want.offer.title}»
          </Text>
        </View>
      ) : null}
    </Surface>
  );
}

const styles = StyleSheet.create({
  group: { gap: SPACING.md, marginBottom: SPACING.xl },
  head: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  who: { flex: 1, gap: SPACING.xxs },
  line: { marginTop: SPACING.md, gap: SPACING.xxs },
});
