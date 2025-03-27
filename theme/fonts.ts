import { Platform } from 'react-native';
import { normalizeFontSize } from '@/utils/responsive';

// Базовые шрифты приложения
export const Fonts = {
  gothic: {
    regular: 'Gothic60',
  },
  inter: {
    regular: 'Inter-Regular',
  }
};

// Базовые размеры шрифтов (без нормализации)
const BASE_FONT_SIZES = {
  h1: 22,
  h2: 16,
  h3: 12,
  h4: 10,
  h3Number: 24,
  text: 15,
  description: 12
};

// Нормализованные размеры шрифтов
export const FontSizes = {
  h1: normalizeFontSize(BASE_FONT_SIZES.h1, true, false),
  h2: normalizeFontSize(BASE_FONT_SIZES.h2, true, false),
  h3: normalizeFontSize(BASE_FONT_SIZES.h3, true, false),
  h4: normalizeFontSize(BASE_FONT_SIZES.h4, true, false),
  h3Number: normalizeFontSize(BASE_FONT_SIZES.h3Number, true, false),
  text: normalizeFontSize(BASE_FONT_SIZES.text, false, true),
  description: normalizeFontSize(BASE_FONT_SIZES.description)
};

// Платформо-зависимые множители для line-height
const getLineHeightMultiplier = (fontSize: number) => {
  if (Platform.OS === 'ios') {
    return fontSize <= 14 ? 1.2 : 1.3;
  }
  return fontSize <= 14 ? 1.3 : 1.4;
};

// Line-heights с учетом платформы
export const LineHeights = {
  h1: normalizeFontSize(BASE_FONT_SIZES.h1 * getLineHeightMultiplier(BASE_FONT_SIZES.h1), true, false),
  h2: normalizeFontSize(BASE_FONT_SIZES.h2 * getLineHeightMultiplier(BASE_FONT_SIZES.h2), true, false),
  h3: normalizeFontSize(BASE_FONT_SIZES.h3 * getLineHeightMultiplier(BASE_FONT_SIZES.h3), true, false),
  h4: normalizeFontSize(BASE_FONT_SIZES.h4 * getLineHeightMultiplier(BASE_FONT_SIZES.h4), true, false),
  h3Number: normalizeFontSize(BASE_FONT_SIZES.h3Number * getLineHeightMultiplier(BASE_FONT_SIZES.h3Number), true, false),
  text: normalizeFontSize(BASE_FONT_SIZES.text * getLineHeightMultiplier(BASE_FONT_SIZES.text), false, true),
  description: normalizeFontSize(BASE_FONT_SIZES.description * getLineHeightMultiplier(BASE_FONT_SIZES.description))
};

// Базовые стили шрифтов
export const FontStyles = {
  h1: {
    fontSize: FontSizes.h1,
    fontFamily: Fonts.gothic.regular,
    lineHeight: LineHeights.h1,
  },
  h2: {
    fontSize: FontSizes.h2,
    fontFamily: Fonts.gothic.regular,
    lineHeight: LineHeights.h2,
  },
  h3: {
    fontSize: FontSizes.h3,
    fontFamily: Fonts.gothic.regular,
    lineHeight: LineHeights.h3,
  },
  h4: {
    fontSize: FontSizes.h4,
    fontFamily: Fonts.gothic.regular,
    lineHeight: LineHeights.h4,
  },
  text: {
    fontSize: FontSizes.text,
    fontFamily: Fonts.inter.regular,
    lineHeight: LineHeights.text,
  },
  description: {
    fontSize: FontSizes.description,
    fontFamily: Fonts.inter.regular,
    lineHeight: LineHeights.description,
  }
}; 