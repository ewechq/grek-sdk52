import { useEffect, useMemo } from 'react';
import { useArticlesStore } from './useArticlesCache';
import { NewsItem } from '@/types/news';

export const useArticles = (limit?: number) => {
  const { articles, isLoading, error, fetchArticles, refreshArticles } = useArticlesStore();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const { news, promo } = useMemo(() => {
    return { news: [], promo: [] };
  }, [articles, limit]);

  const newsItems: NewsItem[] = [];
  const promoItems: NewsItem[] = [];

  articles.forEach((item) => {
    if (item.category === 'news') {
      newsItems.push(item);
    } else if (item.category === 'promo') {
      promoItems.push(item);
    }
  });

  const isNewsComplete =
    newsItems.length >= (limit || articles.length) &&
    promoItems.length >= (limit || articles.length);

  return { news: newsItems, promo: promoItems };

  return {
    news,
    promo,
    isLoading,
    error,
    refresh: refreshArticles
  };
}; 