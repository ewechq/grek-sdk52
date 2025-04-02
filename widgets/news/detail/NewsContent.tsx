/**
 * Виджет контента новости
 * 
 * Функциональность:
 * 1. Отображение заголовка новости
 * 2. Форматирование и отображение даты
 * 3. Рендеринг HTML-контента
 * 4. Адаптация под разные платформы
 * 
 * Особенности:
 * - Локализация даты на русский язык
 * - Поддержка HTML-контента
 * - Специальные стили для Android
 * - Условное отображение стилей в зависимости от наличия обложки
 */

import React from 'react';
import { StyleSheet, Text, View, Platform, TextStyle } from 'react-native';
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Colors, TextStyles } from '@/theme';
import HtmlContent from "@/components/ui/text/HtmlContent";

// Определение платформы для специфичных стилей
const IS_ANDROID = Platform.OS === 'android';

/**
 * Пропсы компонента контента новости
 */
interface NewsContentProps {
  title: string;      // Заголовок новости
  content: string;    // HTML-контент новости
  createdAt: string;  // Дата создания
  hasCover?: boolean; // Флаг наличия обложки
}

export const NewsContent = ({ title, content, createdAt, hasCover }: NewsContentProps) => {
  // Форматирование даты на русском языке
  const formattedDate = format(new Date(createdAt), "dd MMM yyyy", { locale: ru });

  return (
    <View style={[
      styles.container, 
      !hasCover && styles.containerNoCover
    ]}>
      {/* Заголовок новости */}
      <Text style={[
        styles.title, 
        IS_ANDROID && styles.androidText
      ]}>
        {title}
      </Text>
      
      {/* Дата создания */}
      <Text style={[
        styles.date, 
        IS_ANDROID && styles.androidText
      ]}>
        {formattedDate}
      </Text>
      
      {/* HTML-контент новости */}
      <HtmlContent 
        html={content} 
        style={styles.content as TextStyle} 
      />
    </View>
  );
};

// Стили компонента
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 200,  // Дополнительный отступ для прокрутки
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
    includeFontPadding: false,    // Убираем лишние отступы в Android
    textAlignVertical: 'center',  // Центрирование текста по вертикали
  },
});