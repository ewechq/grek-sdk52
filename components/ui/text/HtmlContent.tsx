import React, { useMemo } from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { TextStyles, Colors } from '@/theme';

interface HtmlContentProps {
  html: string;
  style?: TextStyle;
}

const formatHtml = (html: string) => {
  return html
    .replace(/<p.*?>/g, '')
    .replace(/<\/p>/g, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<.*?>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .trim();
};

const HtmlContent = ({ html, style }: HtmlContentProps) => {
  const formattedContent = useMemo(() => formatHtml(html), [html]);

  return (
    <Text style={[styles.text, style]}>
      {formattedContent}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    ...TextStyles.text,
    color: Colors.black,
    lineHeight: 18,
  },
});

export default HtmlContent; 