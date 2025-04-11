import React, { useMemo, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useArticlesStore } from '@/hooks/news/useArticlesCache';
import { NewsItem } from "@/types/news";
import { getOptimizedImageUrl } from "@/utils/images";
import Header from "@/components/ui/layout/Header";
import { LoadingState } from "@/components/ui/feedback/LoadingState";
import { ErrorState } from "@/components/ui/feedback/ErrorState";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { NewsImage } from "@/widgets/news/detail/NewsImage";
import { NewsContent } from "@/widgets/news/detail/NewsContent";
import { Colors } from "@/theme";
import { CustomRefreshControl } from "@/components/ui/feedback/RefreshControl";

const NewsDetail = () => {
  const { id } = useLocalSearchParams();
  const { articles, isLoading, error, refreshArticles } = useArticlesStore();
  const [refreshing, setRefreshing] = useState(false);

  const newsItem = useMemo(() => {
    if (!id) return null;
    const item = articles.find((item: NewsItem) => item.id === Number(id));
    return item;
  }, [articles, id]);

  const imageUri = useMemo(() => 
    getOptimizedImageUrl(newsItem?.cover || null),
  [newsItem?.cover]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshArticles();
    setRefreshing(false);
  };

  if (isLoading && !newsItem) {
    return <LoadingState loading={true} />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  if (!newsItem) {
    return <EmptyState message="Новость не найдена" />;
  }

  return (
    <ScrollView 
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <CustomRefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
    >
      <Header title='Подробнее' marginTop={32}/>
      <NewsImage imageUri={imageUri} />
      <NewsContent 
        title={newsItem.title}
        content={newsItem.content}
        createdAt={newsItem.created_at}
        hasCover={!!imageUri}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
    backgroundColor: Colors.white,
  },
});

export default NewsDetail;