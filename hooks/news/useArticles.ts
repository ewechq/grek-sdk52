import { useEffect, useMemo } from 'react';
import { useArticlesStore } from './useArticlesCache';
import { NewsItem } from '@/types/news';

export const useArticles = (limit?: number) => {
  const { articles, isLoading, error, fetchArticles } = useArticlesStore();

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const { news, blog } = useMemo(() => {
    if (!articles?.length) {
      return { news: [], blog: [] };
    }

    const newsItems = [];
    const blogItems = [];

    // Делаем один проход по массиву вместо двух filter
    for (const item of articles) {
      if (newsItems.length < (limit || articles.length) && item.category === 'news') {
        newsItems.push(item);
      } else if (blogItems.length < (limit || articles.length) && item.category === 'blog') {
        blogItems.push(item);
      }

      // Если обе категории заполнены, прерываем цикл
      if (newsItems.length >= (limit || articles.length) && 
          blogItems.length >= (limit || articles.length)) {
        break;
      }
    }

    return { news: newsItems, blog: blogItems };
  }, [articles, limit]);

  return {
    news,
    blog,
    isLoading,
    error
  };
}; 