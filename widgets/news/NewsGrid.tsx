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

import { StyleSheet, View, FlatList, Dimensions, ListRenderItem, Text } from 'react-native';
import React, { useCallback } from 'react';
import NewsCard from '@/components/pages/news/NewsCard';
import { NewsItem } from '@/types/news';
import { Colors } from '@/theme';
import CustomRefreshControl from '@/components/ui/feedback/RefreshControl';
import SegmentedTabs from '@/components/ui/btns/SegmentedTabs';
import { Typography } from '@/theme';
import MainHeader from '@/components/ui/layout/MainHeader';

// Получаем ширину экрана для расчета размеров карточек
const { width } = Dimensions.get('window');

/**
 * Пропсы компонента сетки новостей
 */
interface NewsGridProps {
  news: NewsItem[];  // Массив новостей
  refreshing?: boolean; // Состояние обновления
  onRefresh?: () => void; // Функция обновления
  heading?: string;
  tabs?: string[];
  selectedTab?: number;
  onSelectTab?: (index: number) => void;
}

const NewsGrid = ({ news, refreshing = false, onRefresh, heading, tabs, selectedTab, onSelectTab }: NewsGridProps) => {
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
        columnWrapperStyle={styles.row}
        initialNumToRender={8}           // Начальное количество отображаемых элементов
        maxToRenderPerBatch={4}          // Максимальное количество элементов в пакете рендеринга
        windowSize={5}                   // Размер окна видимости
        removeClippedSubviews={true}     // Удаление невидимых элементов из памяти
        ListHeaderComponent={<View >
          <MainHeader />
      {heading ? (
        <Text style={styles.heading}>{heading}</Text>
      ) : null}
      {tabs && typeof selectedTab === 'number' && onSelectTab ? (
        <SegmentedTabs
          tabs={tabs}
          selectedIndex={selectedTab}
          onSelect={onSelectTab}
        />
      ) : null}
        </View>}
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
export default NewsGrid;
// Стили компонента
const styles = StyleSheet.create({
  cardContainer: {
    width: "49%", 
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },

  footer: {
    height: 140, 
  },
  heading: {
    ...Typography.h2(),
    textTransform: 'uppercase',
    alignSelf: 'center',
    marginTop:40,
    marginBottom:16
  },
});