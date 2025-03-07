import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, ActivityIndicator, Text, Platform } from 'react-native';
import { useArticles } from '@/hooks/news/useArticles';
import { Colors, TextStyles } from '@/theme';
import { NewsSection } from '@/widgets/news/NewsSection';
import NewsSliderSection from '@/widgets/news/NewsSliderSection';

const LATEST_NEWS_COUNT = 6;
const IS_ANDROID = Platform.OS === 'android';

export default function NewsScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const { news, blog, isLoading, error } = useArticles(LATEST_NEWS_COUNT);

  if (isLoading && !news?.length) {
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
      removeClippedSubviews={IS_ANDROID}
      scrollEventThrottle={IS_ANDROID ? 32 : 16}
    >
      {news.length > 0 && (
        <View style={styles.newsContainer}>
          <NewsSliderSection news={news} parentScrollRef={scrollViewRef} />
          
          <View>
            <NewsSection 
              news={news}
              title="Новости"
              category="news"
            />
          </View>

          {blog.length > 0 && (
            <View style={styles.lastSection}>
              <NewsSection 
                news={blog}
                title="Блог"
                category="blog"
              />
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  newsContainer: {
    flex: 1,
    paddingBottom: IS_ANDROID ? 16 : 0,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  lastSection: {
    paddingBottom: 140,
  },
  error: {
    color: 'red',
    ...TextStyles.text,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});