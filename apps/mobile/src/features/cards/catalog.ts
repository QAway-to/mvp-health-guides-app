import type { AssetKind } from './types';

/**
 * Справочник видов ресурса: подпись, иконка и порядок.
 *
 * Порядок фиксированный и одинаковый в обеих колонках — так две колонки
 * читаются как таблица, и глаз сам находит строку напротив.
 */
export const ASSET_KINDS: readonly AssetKind[] = [
  'space',
  'capital',
  'contacts',
  'team',
  'expertise',
] as const;

type KindMeta = {
  /** Подпись в колонке «что ищу». */
  readonly needLabel: string;
  /** Подпись в колонке «что предлагаю». */
  readonly offerLabel: string;
  /** Имя иконки Ionicons. */
  readonly icon: 'business-outline' | 'cash-outline' | 'people-outline' | 'construct-outline' | 'bulb-outline';
};

/**
 * Подписи у видов разные с двух сторон, и это не украшательство.
 * «Помещение» в требованиях означает «ищу площадь», в предложениях —
 * «сдаю свою». Одно слово на оба случая заставляло бы додумывать.
 */
export const KIND_META: Readonly<Record<AssetKind, KindMeta>> = {
  space: { needLabel: 'Ищу помещение', offerLabel: 'Есть помещение', icon: 'business-outline' },
  capital: { needLabel: 'Ищу инвестиции', offerLabel: 'Готов вложить', icon: 'cash-outline' },
  contacts: { needLabel: 'Нужны контакты', offerLabel: 'Открою контакты', icon: 'people-outline' },
  team: { needLabel: 'Нужна команда', offerLabel: 'Есть команда', icon: 'construct-outline' },
  expertise: { needLabel: 'Нужна экспертиза', offerLabel: 'Моя экспертиза', icon: 'bulb-outline' },
};

/** Короткое имя вида — для тесных мест вроде плитки в ленте. */
export const KIND_SHORT: Readonly<Record<AssetKind, string>> = {
  space: 'Помещения',
  capital: 'Капитал',
  contacts: 'Контакты',
  team: 'Команда',
  expertise: 'Экспертиза',
};
