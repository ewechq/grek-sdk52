import React from 'react';
import { StyleSheet, Text, View, Platform, TextStyle } from 'react-native';
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Colors, TextStyles } from '@/theme';
import HtmlContent from "@/components/ui/text/HtmlContent";

const IS_ANDROID = Platform.OS === 'android';

interface NewsContentProps {
  title: string;
  content: string;
  createdAt: string;
  hasCover?: boolean;
}

export const NewsContent = ({ title, content, createdAt, hasCover }: NewsContentProps) => {
  const formattedDate = format(new Date(createdAt), "dd MMM yyyy", { locale: ru });

  return (
    <View style={[
      styles.container, 
      !hasCover && styles.containerNoCover
    ]}>
      <Text style={[
        styles.title, 
        IS_ANDROID && styles.androidText
      ]}>
        {title}
      </Text>
      <Text style={[
        styles.date, 
        IS_ANDROID && styles.androidText
      ]}>
        {formattedDate}
      </Text>
      <HtmlContent 
        html={content} 
        style={styles.content as TextStyle} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 200,
  },
  containerNoCover: {
    marginTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  title: {
    ...TextStyles.h2,
    marginBottom: 10,
    textAlign: 'center',
  },
  date: {
    ...TextStyles.text,
    color: Colors.grayText,
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    color: Colors.black,
    lineHeight: 24,
  },
  androidText: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});