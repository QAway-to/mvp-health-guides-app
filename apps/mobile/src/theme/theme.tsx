import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';

import { PALETTE, RADIUS, SPACING, TYPE, type Colors, type ColorScheme } from './tokens';

type Theme = {
  scheme: ColorScheme;
  colors: Colors;
  spacing: typeof SPACING;
  radius: typeof RADIUS;
  type: typeof TYPE;
};

const ThemeContext = createContext<Theme | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme: ColorScheme = useColorScheme() === 'dark' ? 'dark' : 'light';

  const value = useMemo<Theme>(
    () => ({
      scheme,
      colors: PALETTE[scheme],
      spacing: SPACING,
      radius: RADIUS,
      type: TYPE,
    }),
    [scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const theme = useContext(ThemeContext);
  if (!theme) {
    throw new Error('useTheme вызван вне ThemeProvider');
  }
  return theme;
}
