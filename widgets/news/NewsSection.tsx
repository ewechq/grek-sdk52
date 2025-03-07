import React, { memo, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, Dimensions, Platform } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import NewsCard from '@/components/news/NewsCard';
import { NewsItem } from '@/types/news';
import { router } from 'expo-router';
import { SectionHeader } from '@/components/SectionHeader';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.5;
const CARD_MARGIN = 4;
const IS_ANDROID = Platform.OS === 'android';

interface NewsSectionProps {
  title: string;
  news: NewsItem[];
  category: 'news' | 'blog';
}

export const NewsSection: React.FC<NewsSectionProps> = memo(({ 
  title, 
  news,
  category
}) => {
  const handleShowAll = useCallback(() => {
    router.push(`/(tabs)/news/all?category=${category}`);
  }, [category]);

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

  const keyExtractor = useCallback((item: NewsItem) => `${category}_${item.id}`, [category]);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: CARD_WIDTH,
    offset: (CARD_WIDTH + CARD_MARGIN) * index,
    index,
  }), []);

  const memoizedData = useMemo(() => news, [news]);

  return (
    <View style={styles.container}>
      <SectionHeader 
        title={title}
        onPress={handleShowAll}
      />
      
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
  if (prevProps.title !== nextProps.title || 
      prevProps.category !== nextProps.category || 
      prevProps.news.length !== nextProps.news.length) {
    return false;
  }
  return prevProps.news.every((item, index) => item.id === nextProps.news[index].id);
});

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