import { StyleSheet, View } from 'react-native';
import React from 'react';
import { useArticles } from '@/hooks/news/useArticles';
import { Colors } from '@/theme';
import Header from '@/components/Header';
import { LoadingState } from '@/components/state/LoadingState';
import { ErrorState } from '@/components/state/ErrorState';
import { EmptyState } from '@/components/state/EmptyState';
import { NewsGrid } from '@/widgets/news/all/NewsGrid';

export default function AllNewsScreen() {
  const { news, isLoading, error } = useArticles();

  if (isLoading) {
    return <LoadingState loading={true} />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!news?.length) {
    return <EmptyState message="Нет доступных новостей" />;
  }

  return (
    <View style={styles.container}>
      <Header title="Новости" />
      <NewsGrid news={news} />
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