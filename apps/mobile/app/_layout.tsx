import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { Oswald_500Medium, Oswald_600SemiBold } from '@expo-google-fonts/oswald';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { CardsProvider } from '@/features/cards/store';
import { ThemeProvider, useTheme } from '@/theme/theme';

SplashScreen.preventAutoHideAsync().catch(() => {
  // Сплэш мог быть уже скрыт при быстром hot reload — это не ошибка.
});

/**
 * СЕРВЕРА ЗДЕСЬ ПОКА НЕТ, И ЭТО ОСОЗНАННО.
 *
 * Раньше в корне стояли клиент Supabase и react-query. Клиент падал прямо на
 * импорте, если не заданы EXPO_PUBLIC_SUPABASE_*, — а значит приложение не
 * открывалось без поднятого стека. Пока состав карточки меняется от разговора
 * к разговору, схему в базе заводить рано, и цена этой связки — невозможность
 * просто открыть приложение на телефоне — слишком велика.
 *
 * Вернём, когда модель карточки устоится.
 */
export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Oswald_500Medium,
    Oswald_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    // Шрифт может не загрузиться, и это не повод держать пользователя на
    // сплэше вечно: системный шрифт хуже, но приложение работает.
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <CardsProvider>
          <ThemedStack />
        </CardsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function ThemedStack() {
  const { colors, scheme } = useTheme();

  return (
    <>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShadowVisible: false,
          headerStyle: { backgroundColor: colors.canvas },
          headerTintColor: colors.ink,
          contentStyle: { backgroundColor: colors.canvas },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
