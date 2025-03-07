import { StyleSheet, View, FlatList, Dimensions, ListRenderItem } from 'react-native';
import React, { useCallback } from 'react';
import NewsCard from '@/components/pages/news/NewsCard';
import { NewsItem } from '@/types/news';
import { Colors } from '@/theme';

const { width } = Dimensions.get('window');

interface NewsGridProps {
  news: NewsItem[];
}

export const NewsGrid = ({ news }: NewsGridProps) => {
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

  const keyExtractor = useCallback((item: NewsItem) => item.id.toString(), []);

  return (
    <FlatList<NewsItem>
      data={news}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      columnWrapperStyle={styles.row}
      initialNumToRender={6}
      maxToRenderPerBatch={4}
      windowSize={5}
      removeClippedSubviews={true}
      ListFooterComponent={<View style={styles.footer} />}
    />
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: (width - 48) / 2,
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
    height: 80,
  },
});