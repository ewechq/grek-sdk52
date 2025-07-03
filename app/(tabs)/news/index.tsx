import { StyleSheet, View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { useArticles } from '@/hooks/news/useArticles';
import { Colors } from '@/theme';
import { TextStyles } from '@/theme';
import { LoadingState } from '@/components/ui/feedback/LoadingState';
import { ErrorState } from '@/components/ui/feedback/ErrorState';
import { EmptyState } from '@/components/ui/feedback/EmptyState';
import NewsGrid from '@/widgets/news/NewsGrid';
import SegmentedTabs from '@/components/ui/btns/SegmentedTabs'
import MainHeader from '@/components/ui/layout/MainHeader'
import { useLocalSearchParams } from 'expo-router';
import CustomRefreshControl from '@/components/ui/feedback/RefreshControl';

export default function AllNewsScreen() {
  const { category = 'news' } = useLocalSearchParams<{ category: 'news' | 'blog' }>();
  const { news, promo, isLoading, error, refresh } = useArticles();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

  const filteredArticles = React.useMemo(() => {
    if (selectedTab === 0) {
      return [...news, ...promo];
    } else if (selectedTab === 1) {
      return news;
    } else if (selectedTab === 2) {
      return promo;
    }
    return news;
  }, [news, promo, selectedTab]);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (refresh) {
      await refresh();
    }
    setRefreshing(false);
  };

  if (isLoading && !filteredArticles?.length) {
    return <LoadingState loading={true} />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!filteredArticles?.length) {
    return <EmptyState message={`Нет доступых событий`} />;
  }

  return (
    <View style={styles.container}>
      <NewsGrid 
        news={filteredArticles} 
        refreshing={refreshing} 
        onRefresh={handleRefresh} 
        heading="События в Grek Land"
        tabs={['Все', 'Новости', 'Акции']}
        selectedTab={selectedTab}
        onSelectTab={setSelectedTab}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    gap: 20,
  },
});