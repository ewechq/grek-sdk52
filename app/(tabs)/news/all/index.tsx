import { StyleSheet, View, ActivityIndicator, FlatList, Text, Dimensions, ListRenderItem } from 'react-native';
import React, { useCallback } from 'react';
import  NewsCard  from '@/components/news/NewsCard';
import { useArticles } from '@/hooks/news/useArticles';
import { NewsItem } from '@/types/news';
import { Colors, TextStyles } from '@/theme';
import HeaderInner from '@/components/Header';

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 16;
const GAP_BETWEEN_CARDS = 16;
const CARD_WIDTH = (width - PADDING_HORIZONTAL * 2 - GAP_BETWEEN_CARDS) / 2;

export default function AllNewsScreen() {
  const { news, isLoading, error } = useArticles();

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

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.purple} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!news?.length) {
    return (
      <View style={styles.centered}>
        <Text>Нет доступных новостей</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderInner title="Новости" />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    gap: 20,
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  cardContainer: {
    width: CARD_WIDTH,
  },
  row: {
    justifyContent: 'space-between',
    paddingHorizontal: PADDING_HORIZONTAL,
    marginBottom: 0,
  },
  list: {
    paddingVertical: PADDING_HORIZONTAL,
    paddingBottom: 10,
  },
  footer: {
    height: 80,
  },
  error: {
    color: 'red',
    ...TextStyles.text,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
}); 