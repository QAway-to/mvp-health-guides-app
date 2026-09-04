import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { CARDS, SEED_MY_CARD } from './data';
import type { AssetKind, Card, Entry } from './types';

const STORAGE_KEY = 'my-card:v1';

/** Куда добавляется запись — в требования или в предложения. */
export type Column = 'needs' | 'offers';

type CardsContextValue = {
  readonly myCard: Card;
  /** Все чужие карточки. Своя сюда не входит. */
  readonly cards: readonly Card[];
  /** Загрузка с диска ещё идёт — экраны показывают прошлое состояние сида. */
  readonly loading: boolean;
  /** Правка шапки карточки. Колонки меняются отдельными операциями. */
  updateProfile: (patch: Partial<Pick<Card, 'name' | 'role' | 'city' | 'about'>>) => void;
  addEntry: (column: Column, entry: Omit<Entry, 'id'>) => void;
  removeEntry: (column: Column, entryId: string) => void;
};

const CardsContext = createContext<CardsContextValue | null>(null);

/**
 * Своя карточка живёт на устройстве, чужие — в файле.
 *
 * Разделение временное и намеренное. Правки своей карточки должны переживать
 * перезагрузку, иначе с приложением невозможно играть: любая проба обнуляется.
 * Чужие карточки править некому, поэтому они остаются константой до появления
 * сервера.
 */
export function CardsProvider({ children }: { children: ReactNode }) {
  const [myCard, setMyCard] = useState<Card>(SEED_MY_CARD);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (cancelled || raw === null) return;
        // Сид остаётся запасным вариантом: испорченный JSON в хранилище не
        // должен превращаться в пустой экран без карточки.
        const parsed = JSON.parse(raw) as Card;
        if (parsed && typeof parsed.id === 'string') setMyCard(parsed);
      })
      .catch(() => {
        // Хранилище может быть недоступно — работаем с сидом.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /**
   * Записать на диск, не дожидаясь результата.
   *
   * Ошибку глотаем намеренно: хранилище может быть недоступно, и это не повод
   * терять правку — до перезапуска карточка живёт в памяти в любом случае.
   */
  const save = (next: Card): Card => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
    return next;
  };

  const updateProfile = useCallback<CardsContextValue['updateProfile']>(
    (patch) => {
      setMyCard((current) => save({ ...current, ...patch }));
    },
    [],
  );

  const addEntry = useCallback<CardsContextValue['addEntry']>((column, entry) => {
    setMyCard((current) => {
      // Идентификатор по времени: записи создаются по одной вручную, и
      // столкнуться двум в одну миллисекунду здесь неоткуда.
      const withId: Entry = { ...entry, id: `${column}-${Date.now()}` };
      return save({ ...current, [column]: [...current[column], withId] });
    });
  }, []);

  const removeEntry = useCallback<CardsContextValue['removeEntry']>((column, entryId) => {
    setMyCard((current) =>
      save({ ...current, [column]: current[column].filter((item) => item.id !== entryId) }),
    );
  }, []);

  const value = useMemo<CardsContextValue>(
    () => ({ myCard, cards: CARDS, loading, updateProfile, addEntry, removeEntry }),
    [myCard, loading, updateProfile, addEntry, removeEntry],
  );

  return <CardsContext.Provider value={value}>{children}</CardsContext.Provider>;
}

export function useCards(): CardsContextValue {
  const value = useContext(CardsContext);
  if (value === null) {
    throw new Error('useCards вызван вне CardsProvider');
  }
  return value;
}

/** Найти карточку по идентификатору, включая свою. */
export function useCard(id: string | undefined): Card | undefined {
  const { myCard, cards } = useCards();
  if (id === undefined) return undefined;
  if (id === myCard.id) return myCard;
  return cards.find((card) => card.id === id);
}

/** Виды ресурса, которые встречаются в колонке, — для сводки на плитке. */
export function kindsOf(entries: readonly Entry[]): readonly AssetKind[] {
  return [...new Set(entries.map((entry) => entry.kind))];
}
