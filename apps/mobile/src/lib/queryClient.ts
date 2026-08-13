import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';

const HOUR = 60 * 60 * 1000;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      // Гайды читают на улице, где связь пропадает — кеш переживает
      // перезапуск и отдаёт текст, пока сеть недоступна.
      gcTime: 7 * 24 * HOUR,
      retry: 2,
      refetchOnReconnect: true,
    },
  },
});

/**
 * Кеш на диске.
 *
 * Тексты платных гайдов тоже сохраняются, поэтому после окончания подписки
 * они какое-то время остаются доступными офлайн. Это осознанный компромисс:
 * человек их уже оплатил и прочитал, а срок жизни кеша ограничен неделей.
 */
export const queryPersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'fz-query-cache',
  throttleTime: 2000,
});

export const PERSIST_MAX_AGE = 7 * 24 * HOUR;
