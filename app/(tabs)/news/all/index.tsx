import { StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { useArticles } from '@/hooks/news/useArticles';
import { Colors } from '@/theme';
import Header from '@/components/ui/layout/Header';
import { LoadingState } from '@/components/ui/feedback/LoadingState';
import { ErrorState } from '@/components/ui/feedback/ErrorState';
import { EmptyState } from '@/components/ui/feedback/EmptyState';
import { NewsGrid } from '@/widgets/news/all/NewsGrid';
import { useLocalSearchParams } from 'expo-router';
import { NewsItem } from '@/types/news';

export default function AllNewsScreen() {
  const { category = 'news' } = useLocalSearchParams<{ category: 'news' | 'blog' }>();
  const { news, blog, isLoading, error, refresh } = useArticles();
  const [refreshing, setRefreshing] = useState(false);

  const filteredArticles = React.useMemo(() => {
    return category === 'blog' ? blog : news;
  }, [news, blog, category]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  if (isLoading && !filteredArticles?.length) {
    return <LoadingState loading={true} />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!filteredArticles?.length) {
    return <EmptyState message={`Нет доступных ${category === 'blog' ? 'записей блога' : 'новостей'}`} />;
  }

  return (
    <View style={styles.container}>
      <Header title={category === 'blog' ? 'Блог' : 'Новости'} />
      <NewsGrid 
        news={filteredArticles} 
        refreshing={refreshing} 
        onRefresh={handleRefresh} 
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
});