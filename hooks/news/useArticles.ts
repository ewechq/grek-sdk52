import { useEffect, useMemo } from 'react';
import { useArticlesStore } from './useArticlesCache';
import { NewsItem } from '@/types/news';

export const useArticles = (limit?: number) => {
  const { articles, isLoading, error, fetchArticles } = useArticlesStore();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const { news, blog, promo } = useMemo(() => {
    if (!articles?.length) {
      return { news: [], blog: [], promo: [] };
    }

    const newsItems = [];
    const blogItems = [];
    const promoItems = [];

    // Делаем один проход по массиву вместо нескольких filter
    for (const item of articles) {
      if (newsItems.length < (limit || articles.length) && item.category === 'news') {
        newsItems.push(item);
      } else if (blogItems.length < (limit || articles.length) && item.category === 'blog') {
        blogItems.push(item);
      } else if (promoItems.length < (limit || articles.length) && item.category === 'promo') {
        promoItems.push(item);
      }

      // Если все категории заполнены, прерываем цикл
      if (newsItems.length >= (limit || articles.length) && 
          blogItems.length >= (limit || articles.length) &&
          promoItems.length >= (limit || articles.length)) {
        break;
      }
    }

    return { news: newsItems, blog: blogItems, promo: promoItems };
  }, [articles, limit]);

  return {
    news,
    blog,
    promo,
    isLoading,
    error
  };
}; 