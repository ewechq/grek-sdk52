import React, { useCallback, memo } from 'react';
import { StyleSheet, View, FlatList, Dimensions, ListRenderItem } from 'react-native';
import { NewsItem } from '@/types/news';
import NewsCard from './NewsCard';

const { width } = Dimensions.get('window');
const WIDTH_CARD = width * 0.48;
const MARGIN_CARD = 4;

interface HorizontalNewsListProps {
  news: NewsItem[];
}

export const HorizontalNewsList: React.FC<HorizontalNewsListProps> = memo(({ news }) => {
  const renderItem: ListRenderItem<NewsItem> = useCallback(({ item, index }) => (
    <View style={[
      styles.cardContainer,
      index === 0 ? styles.firstCard : null,
      index === news.length - 1 ? styles.lastCard : null
    ]}>
      <NewsCard
        id={item.id}
        title={item.title}
        introtext={item.introtext}
        cover={item.cover}
      />
    </View>
  ), [news.length]);

  const keyExtractor = useCallback((item: NewsItem) => item.id.toString(), []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: WIDTH_CARD + MARGIN_CARD,
    offset: (WIDTH_CARD + MARGIN_CARD) * index,
    index,
  }), []);

  return (
    <FlatList<NewsItem>
      data={news}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      getItemLayout={getItemLayout}
      initialNumToRender={2}
      maxToRenderPerBatch={2}
      windowSize={3}
      updateCellsBatchingPeriod={75}
      removeClippedSubviews={true}
      snapToInterval={WIDTH_CARD + MARGIN_CARD}
      snapToAlignment="start"
      decelerationRate="fast"
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 10,
      }}
    />
  );
}, (prevProps, nextProps) => {
  if (prevProps.news.length !== nextProps.news.length) return false;
  return prevProps.news.every((item, index) => item.id === nextProps.news[index].id);
});

const styles = StyleSheet.create({
  cardContainer: {
    width: WIDTH_CARD,
    marginHorizontal: MARGIN_CARD,
  },
  firstCard: {
    marginLeft: 16,
  },
  lastCard: {
    marginRight: 16,
  },
  list: {
    paddingVertical: 16,
  },
}); 