import { StyleSheet } from "react-native";
import { Colors } from './colors';
import { Fonts } from './fonts';

export const TextStyles = StyleSheet.create({
  h1: {
    fontSize: 34,
    fontFamily: Fonts.gothic.regular,
    lineHeight: 34,
  },
  h2: {
    fontSize: 16,
    fontFamily: Fonts.gothic.regular,
    lineHeight: 18,
  },
  h3: {
    fontSize: 12,
    fontFamily: Fonts.gothic.regular,
    lineHeight: 16,
  },
  h3Number: {
    fontSize: 24,
    fontFamily: Fonts.gothic.regular,
    lineHeight: 24,
  },
  text: {
    fontSize: 13,
    fontFamily: Fonts.inter.regular,
    lineHeight: 16
  },
  textDescription: {
    fontSize: 10,
    fontFamily: Fonts.inter.regular,
    color: Colors.grayText,
    lineHeight: 12
  }
}); 