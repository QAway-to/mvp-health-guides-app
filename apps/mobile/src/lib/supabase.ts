import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Падаем сразу и внятно: без адреса база молча вернёт пустые списки, и
  // «гайдов нет» будет выглядеть как проблема контента, а не настройки.
  throw new Error(
    'Не заданы EXPO_PUBLIC_SUPABASE_URL и EXPO_PUBLIC_SUPABASE_ANON_KEY — см. apps/mobile/ENVIRONMENT.md',
  );
}

export const supabase = createClient(url, anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    // В приложении нет входа по ссылке: разбор URL здесь только мешал бы
    // диплинкам expo-router.
    detectSessionInUrl: false,
  },
});

/**
 * Гарантировать сессию. Приложение открывается до всякого логина — человек
 * листает бесплатные гайды сразу, — но прогресс нужно к чему-то привязать,
 * поэтому первая же сессия анонимная. Постоянной она становится позже, при
 * покупке или записи к тренеру.
 */
export async function ensureSession(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user) {
    return data.session.user.id;
  }

  const { data: created, error } = await supabase.auth.signInAnonymously();
  if (error) {
    // Офлайн на первом запуске — не повод показывать ошибку: гайды приедут из
    // кеша, а сессия появится при следующем удачном запросе.
    return null;
  }
  return created.user?.id ?? null;
}
