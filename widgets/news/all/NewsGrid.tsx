/**
 * Виджет сетки новостей
 * 
 * Функциональность:
 * 1. Отображение новостей в виде сетки 2xN
 * 2. Оптимизированная производительность списка
 * 3. Адаптивная ширина карточек
 * 
 * Особенности:
 * - Мемоизация функций рендеринга
 * - Оптимизация памяти через removeClippedSubviews
 * - Настраиваемые параметры рендеринга
 * - Отступы для корректного отображения
 */

import { StyleSheet, View, FlatList, Dimensions, ListRenderItem } from 'react-native';
import React, { useCallback } from 'react';
import NewsCard from '@/components/pages/news/NewsCard';
import { NewsItem } from '@/types/news';
import { Colors } from '@/theme';
import { CustomRefreshControl } from '@/components/ui/feedback/RefreshControl';

// Получаем ширину экрана для расчета размеров карточек
const { width } = Dimensions.get('window');

/**
 * Пропсы компонента сетки новостей
 */
interface NewsGridProps {
  news: NewsItem[];  // Массив новостей
  refreshing?: boolean; // Состояние обновления
  onRefresh?: () => void; // Функция обновления
}

export const NewsGrid = ({ news, refreshing = false, onRefresh }: NewsGridProps) => {
  /**
   * Рендер элемента сетки
   * Мемоизирован для оптимизации производительности
   */
  const renderItem: ListRenderItem<NewsItem> = useCallback(({ item }) => (
    <View style={styles.cardContainer}>
      <NewsCard
        id={item.id}
        title={item.title}
        introtext={item.introtext}
        cover={item.cover}
      />
    </View>
  ), []);

  /**
   * Генерация уникального ключа для элемента списка
   */
  const keyExtractor = useCallback((item: NewsItem) => item.id.toString(), []);

  return (
    <FlatList<NewsItem>
      data={news}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={2}                    // Два столбца в сетке
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      initialNumToRender={6}           // Начальное количество отображаемых элементов
      maxToRenderPerBatch={4}          // Максимальное количество элементов в пакете рендеринга
      windowSize={5}                   // Размер окна видимости
      removeClippedSubviews={true}     // Удаление невидимых элементов из памяти
      ListFooterComponent={<View style={styles.footer} />}  // Отступ в конце списка
      refreshControl={
        onRefresh ? (
          <CustomRefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : undefined
      }
    />
  );
};

// Стили компонента
const styles = StyleSheet.create({
  cardContainer: {
    width: (width - 48) / 2,  // Ширина карточки с учетом отступов
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 0,
  },
  list: {
    paddingVertical: 16,
    paddingBottom: 10,
  },
  footer: {
    height: 80,  // Отступ в конце списка
  },
});