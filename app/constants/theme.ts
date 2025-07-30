const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const COLORS = {
  primary: '#007BFF',   // Azul principal
  secondary: '#17a2b8', // Ciano para ações secundárias
  success: '#28a745',   // Verde para sucesso
  danger: '#dc3545',    // Vermelho para perigo/cancelar
  light: '#f8f9fa',     // Cinza muito claro
  gray: '#6c757d',      // Cinza para texto secundário
  dark: '#343a40',      // Preto suave
  white: '#ffffff',

  lightTheme: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
  },
  darkTheme: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
  },
};

export const SPACING = {
  small: 8,
  medium: 16,
  large: 24,
};

export const FONT_SIZES = {
  small: 14,
  medium: 16,
  large: 18,
  title: 24,
  header: 28,
};

export const theme = {
  colors: COLORS,
  spacing: SPACING,
  fontSizes: FONT_SIZES,
};