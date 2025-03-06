import { useMemo, useEffect } from 'react';
import { useArticlesStore } from './useArticlesCache';
import { NewsItem } from '@/types/news';

export const useArticles = (limit?: number) => {
  const { articles, isLoading, error, fetchArticles } = useArticlesStore();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const news = useMemo(() => {
    return articles
      .filter((item: NewsItem) => item.category === 'news')
      .slice(0, limit);
  }, [articles, limit]);

  const blog = useMemo(() => {
    return articles
      .filter((item: NewsItem) => item.category === 'blog')
      .slice(0, limit);
  }, [articles, limit]);

  return {
    articles,
    news,
    blog,
    isLoading,
    error
  };
}; 