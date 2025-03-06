import { useState, useEffect } from 'react';
import { NewsItem, NewsResponse } from '@/types/news';

const API_URL = 'https://api.grekland.ru/api/articles';

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();      
      const allItems = Array.isArray(data) ? data : data.data || [];
      const newsItems = allItems.filter((item: NewsItem) => item.category === 'news');

      setNews(newsItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке новостей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return {
    news,
    loading,
    error,
    refreshNews: fetchNews
  };
}; 