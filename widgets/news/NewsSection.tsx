/**
 * Виджет секции новостей
 * 
 * Функциональность:
 * 1. Отображение горизонтального списка новостей
 * 2. Оптимизированная производительность для Android и iOS
 * 3. Поддержка категорий новостей и блога
 * 4. Навигация к полному списку
 * 
 * Особенности:
 * - Мемоизация компонента и его функций
 * - Адаптивные размеры карточек
 * - Оптимизация рендеринга для разных платформ
 * - Плавная прокрутка с snap-эффектом
 */

import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, Dimensions, Platform } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import NewsCard from '@/components/pages/news/NewsCard';
import { NewsItem } from '@/types/news';
import { router } from 'expo-router';
import { SectionHeader } from '@/components/ui/layout/SectionHeader';

// Константы для расчета размеров
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.5;  // Ширина карточки - половина экрана
const CARD_MARGIN = 4;           // Отступ между карточками
const IS_ANDROID = Platform.OS === 'android';

/**
 * Пропсы компонента секции новостей
 */
interface NewsSectionProps {
  title: string;                // Заголовок секции
  news: NewsItem[];            // Массив новостей
  category: 'news' | 'blog';   // Категория контента
}

export const NewsSection: React.FC<NewsSectionProps> = memo(({ 
  title, 
  news,
  category
}) => {
  /**
   * Обработчик нажатия на "Показать все"
   * Перенаправляет на страницу со всеми новостями выбранной категории
   */
  const handleShowAll = useCallback(() => {
    router.push(`/(tabs)/news/all?category=${category}`);
  }, [category]);

  /**
   * Рендер элемента списка
   * Мемоизирован для оптимизации производительности
   */
  const renderItem = useCallback(({ item }: { item: NewsItem }) => (
    <View style={styles.cardWrapper}>
      <NewsCard
        id={item.id}
        title={item.title}
        introtext={item.introtext}
        cover={item.cover || ''}
      />
    </View>
  ), []);

  /**
   * Генерация уникального ключа для элемента списка
   */
  const keyExtractor = useCallback((item: NewsItem) => `${category}_${item.id}`, [category]);

  /**
   * Оптимизация производительности FlatList
   * Предварительный расчет размеров элементов
   */
  const getItemLayout = useCallback((_: any, index: number) => ({
    length: CARD_WIDTH,
    offset: (CARD_WIDTH + CARD_MARGIN) * index,
    index,
  }), []);

  // Мемоизация данных для предотвращения лишних ререндеров
  const memoizedData = useMemo(() => news, [news]);

  return (
    <View style={styles.container}>
      {/* Заголовок секции с кнопкой "Показать все" */}
      <SectionHeader 
        title={title}
        onPress={handleShowAll}
      />
      
      {/* Горизонтальный список новостей */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={memoizedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.slider}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
        removeClippedSubviews={IS_ANDROID}
        initialNumToRender={IS_ANDROID ? 2 : 3}
        maxToRenderPerBatch={IS_ANDROID ? 1 : 2}
        windowSize={IS_ANDROID ? 2 : 3}
        updateCellsBatchingPeriod={IS_ANDROID ? 150 : 75}
        getItemLayout={getItemLayout}
        scrollEventThrottle={IS_ANDROID ? 32 : 16}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
      />
    </View>
  );
}, (prevProps, nextProps) => {
  // Оптимизация ререндеров через глубокое сравнение пропсов
  if (prevProps.title !== nextProps.title || 
      prevProps.category !== nextProps.category || 
      prevProps.news.length !== nextProps.news.length) {
    return false;
  }
  return prevProps.news.every((item, index) => item.id === nextProps.news[index].id);
});

// Стили компонента
const styles = StyleSheet.create({
  container: {
    marginTop: IS_ANDROID ? 8 : 16,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    paddingRight: CARD_MARGIN,
  },
  slider: {
    paddingHorizontal: 12,
  },
}); 