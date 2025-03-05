import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Базовые размеры для iPhone 12
const baseWidth = 375;
const baseHeight = 812;

const scale = Math.min(SCREEN_WIDTH / baseWidth, SCREEN_HEIGHT / baseHeight);

export const normalize = (size: number) => {
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Специальная функция для шрифтов
export const normalizeFontSize = (size: number, isHeading = false, isText = false) => {
  const baseScale = size / baseWidth;
  const newSize = Math.round(SCREEN_WIDTH * baseScale);

  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    // Для Android:
    // - базовое увеличение на 2 пункта для всех
    // - дополнительно 1 пункт для заголовков
    // - дополнительно 1 пункт для обычного текста
    const androidSize = size + 2 + (isHeading ? 1 : 0)+(isText ? 1 : 0) ;
    const androidBaseScale = androidSize / baseWidth;
    const androidNewSize = Math.round(SCREEN_WIDTH * androidBaseScale);
    // Применяем коэффициент масштабирования для Android
    const androidFontScale = size <= 14 ? 0.85 : 0.9;
    return Math.round(PixelRatio.roundToNearestPixel(androidNewSize * androidFontScale));
  }
};

// Отступы остаются прежними
export const spacing = {
  xs: normalize(4),
  sm: normalize(8),
  md: normalize(16),
  lg: normalize(24),
  xl: normalize(32),
  xxl: normalize(40),
};

// Обновляем размеры при изменении ориентации
Dimensions.addEventListener('change', ({ window: { width, height } }) => {
  const newWidthScale = width / baseWidth;
  const newHeightScale = height / baseHeight;
  Object.assign(scale, Math.min(newWidthScale, newHeightScale));
}); 