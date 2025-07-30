import { useColorScheme } from 'react-native';
import { COLORS } from '../constants/theme'; // Importe a paleta unificada

// O tipo agora reflete as chaves dos temas de cores
type ThemeColorName = keyof typeof COLORS.lightTheme & keyof typeof COLORS.darkTheme;

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorName
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Acessa o tema (lightTheme ou darkTheme) e depois a propriedade da cor
    const themeKey = theme === 'light' ? 'lightTheme' : 'darkTheme';
    return COLORS[themeKey][colorName];
  }
}