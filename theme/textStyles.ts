import { StyleSheet } from "react-native";
import { Colors } from './colors';
import { Fonts, FontSizes, LineHeights } from './fonts';

// Готовые текстовые стили для использования в компонентах
export const TextStyles = StyleSheet.create({
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
  h3Number: {
    fontSize: FontSizes.h3Number,
    fontFamily: Fonts.gothic.regular,
    lineHeight: LineHeights.h3Number,
  },
  text: {
    fontSize: FontSizes.text,
    fontFamily: Fonts.inter.regular,
    lineHeight: LineHeights.text,
  },
  textDescription: {
    fontSize: FontSizes.description,
    fontFamily: Fonts.inter.regular,
    lineHeight: LineHeights.description,
    color: Colors.grayText,
  }
}); 