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

import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Colors, TextStyles } from '@/theme';
import RichContent from "@/components/ui/text/RichContent";
import { MixedStyleDeclaration } from 'react-native-render-html';

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

export const NewsContent = React.memo(({ 
  title, 
  content, 
  createdAt, 
  hasCover = false 
}: NewsContentProps) => {
  const formattedDate = useMemo(() => 
    format(new Date(createdAt), "dd MMM yyyy", { locale: ru }),
    [createdAt]
  );

  const containerStyle = useMemo(() => [
    styles.container, 
    !hasCover && styles.containerNoCover
  ], [hasCover]);

  const titleStyle = useMemo(() => [
    styles.title, 
    IS_ANDROID && styles.androidText
  ], []);

  const dateStyle = useMemo(() => [
    styles.date, 
    IS_ANDROID && styles.androidText
  ], []);

  const baseStyle = useMemo(() => ({
    color: Colors.black,
    lineHeight: 24,
  }), []);

  return (
    <View style={containerStyle}>
      {/* Заголовок новости */}
      <Text style={titleStyle}>
        {title}
      </Text>
      
      {/* Дата создания */}
      <Text style={dateStyle}>
        {formattedDate}
      </Text>
      
      {/* HTML-контент новости */}
      <RichContent 
        html={content} 
        baseStyle={baseStyle as MixedStyleDeclaration}
      />
    </View>
  );
});

// Стили компонента
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
    ...TextStyles.textDescription,
    color: Colors.grayText,
    marginBottom: 20,
    textAlign: 'center',
  },
  androidText: {
    includeFontPadding: false,    
    textAlignVertical: 'center',  
  },
});