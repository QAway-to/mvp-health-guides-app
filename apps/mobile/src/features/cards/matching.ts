import type { Card, Entry } from './types';

/** Одно совпадение: чей-то запрос закрывается чьим-то предложением. */
export type MatchLink = {
  readonly need: Entry;
  readonly offer: Entry;
  /** Теги, по которым сошлось, — их и показываем как объяснение. */
  readonly shared: readonly string[];
};

export type Match = {
  readonly card: Card;
  /** Их предложения под мои запросы — что я получу. */
  readonly theyGive: readonly MatchLink[];
  /** Мои предложения под их запросы — что получат они. */
  readonly theyWant: readonly MatchLink[];
  /** Сходится в обе стороны. */
  readonly mutual: boolean;
  readonly score: number;
};

function shared(need: Entry, offer: Entry): readonly string[] {
  const offered = new Set(offer.tags);
  return need.tags.filter((tag) => offered.has(tag));
}

/**
 * Сопоставить одну колонку запросов с одной колонкой предложений.
 *
 * Вид ресурса должен совпасть, и должен найтись хотя бы один общий тег.
 * Только вида мало: «нужны контакты в рознице» и «открою контакты в
 * логистике» — один вид и не имеют друг к другу отношения.
 *
 * На каждый запрос берётся одно, лучшее предложение. Запрос может задеть
 * несколько строк чужой карточки, но человеку нужен ответ «чем именно вы
 * друг другу полезны», а не полный перебор пересечений.
 */
function linksBetween(needs: readonly Entry[], offers: readonly Entry[]): readonly MatchLink[] {
  const links: MatchLink[] = [];

  for (const need of needs) {
    let best: MatchLink | null = null;

    for (const offer of offers) {
      if (offer.kind !== need.kind) continue;

      const common = shared(need, offer);
      if (common.length === 0) continue;

      if (best === null || common.length > best.shared.length) {
        best = { need, offer, shared: common };
      }
    }

    if (best !== null) links.push(best);
  }

  return links;
}

/**
 * Найти совпадения моей карточки с чужой.
 *
 * `null` означает «не пересеклись» — это обычное состояние для большей части
 * базы, и отдельная сущность «пустой матч» ничего не добавляет.
 */
export function matchCards(mine: Card, other: Card): Match | null {
  if (mine.id === other.id) return null;

  const theyGive = linksBetween(mine.needs, other.offers);
  const theyWant = linksBetween(other.needs, mine.offers);

  if (theyGive.length === 0 && theyWant.length === 0) return null;

  const mutual = theyGive.length > 0 && theyWant.length > 0;

  return {
    card: other,
    theyGive,
    theyWant,
    mutual,
    // Взаимность весит больше любого количества совпадений в одну сторону:
    // односторонний матч — это просьба, встречный — уже сделка.
    score: theyGive.length + theyWant.length + (mutual ? 10 : 0),
  };
}

/** Все совпадения по базе, сильные сверху. */
export function findMatches(mine: Card, cards: readonly Card[]): readonly Match[] {
  return cards
    .map((card) => matchCards(mine, card))
    .filter((match): match is Match => match !== null)
    .sort((a, b) => b.score - a.score);
}
