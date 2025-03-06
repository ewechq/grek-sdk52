import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View, ScrollView, FlatList, Text, Dimensions, ListRenderItem, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import NewsCard from '@/components/news/NewsCard';
import { NewsSlider } from '@/components/NewsSlider';
import { useArticles } from '@/hooks/useArticles';
import { useArticlesStore } from '@/hooks/useArticlesCache';
import { NewsItem } from '@/types/news';
import { Colors, TextStyles } from '@/theme';

const { width } = Dimensions.get('window');
const WIDTH_CARD = width * 0.48;
const MARGIN_CARD = 4;
const LATEST_NEWS_COUNT = 6;

export default function NewsScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { news, blog, isLoading, error } = useArticles(LATEST_NEWS_COUNT);
  const articlesStore = useArticlesStore();

  const handleNewsHeaderPress = useCallback(() => {
    router.push({
      pathname: '/(tabs)/news/all',
      params: { category: 'news' }
    });
  }, []);

  const handleBlogHeaderPress = useCallback(() => {
    router.push({
      pathname: '/(tabs)/news/all',
      params: { category: 'blog' }
    });
  }, []);

  const renderItem: ListRenderItem<NewsItem> = useCallback(({ item, index }) => (
    <View style={[
      styles.cardContainer,
      index === 0 ? styles.firstCard : null,
      index === 5 ? styles.lastCard : null
    ]}>
      <NewsCard
        id={item.id}
        title={item.title}
        introtext={item.introtext}
        cover={item.cover}
      />
    </View>
  ), []);

  const keyExtractor = useCallback((item: NewsItem) => item.id.toString(), []);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: WIDTH_CARD + MARGIN_CARD,
    offset: (WIDTH_CARD + MARGIN_CARD) * index,
    index,
  }), []);

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

  return (
    <ScrollView 
      ref={scrollViewRef}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {news && news.length > 0 && (
        <NewsSlider news={news} parentScrollRef={scrollViewRef} />
      )}

      <View style={styles.section}>
        <TouchableOpacity style={styles.header} onPress={handleNewsHeaderPress} activeOpacity={0.7}>
          <Text style={TextStyles.h2}>Новости</Text>
          <Ionicons name="chevron-forward-outline" size={16} color={Colors.grayText} />
        </TouchableOpacity>
        <FlatList<NewsItem>
          data={news}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          getItemLayout={getItemLayout}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
          removeClippedSubviews={true}
          snapToInterval={WIDTH_CARD + MARGIN_CARD}
          snapToAlignment="start"
          decelerationRate="fast"
        />
      </View>

      <View style={[styles.section, { paddingBottom: 120 }]}>
        <TouchableOpacity style={styles.header} onPress={handleBlogHeaderPress} activeOpacity={0.7}>
          <Text style={TextStyles.h2}>Блог</Text>
          <Ionicons name="chevron-forward-outline" size={16} color={Colors.grayText} />
        </TouchableOpacity>
        <FlatList<NewsItem>
          data={blog}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          getItemLayout={getItemLayout}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={5}
          removeClippedSubviews={true}
          snapToInterval={WIDTH_CARD + MARGIN_CARD}
          snapToAlignment="start"
          decelerationRate="fast"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  section: {
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
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
  error: {
    color: 'red',
    ...TextStyles.text,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});