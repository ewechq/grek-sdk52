import React, { useMemo } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useArticlesStore } from '@/hooks/news/useArticlesCache';
import { NewsItem } from "@/types/news";
import { getOptimizedImageUrl } from "@/utils/images";
import Header from "@/components/Header";
import { LoadingState } from "@/components/state/LoadingState";
import { ErrorState } from "@/components/state/ErrorState";
import { EmptyState } from "@/components/state/EmptyState";
import { NewsImage } from "@/widgets/news/detail/NewsImage";
import { NewsContent } from "@/widgets/news/detail/NewsContent";

const NewsDetail = () => {
  const { id } = useLocalSearchParams();
  const { articles, isLoading, error } = useArticlesStore();

  const newsItem = useMemo(() => {
    if (!id) return null;
    const item = articles.find((item: NewsItem) => item.id === Number(id));
    return item;
  }, [articles, id]);

  const imageUri = useMemo(() => 
    getOptimizedImageUrl(newsItem?.cover || null),
  [newsItem?.cover]);

  if (isLoading) {
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
    backgroundColor: "white",
  },
});

export default NewsDetail;