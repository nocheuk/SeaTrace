import { createContext, useContext } from 'react';
import { ColorScheme, darkTheme, lightTheme } from './tokens';

export type Theme = typeof lightTheme | typeof darkTheme;

type ThemeContextValue = {
  theme: Theme;
  colorScheme: ColorScheme;
};

export const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  colorScheme: 'light',
});

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}

export { darkTheme, lightTheme };
export type { ColorScheme };
