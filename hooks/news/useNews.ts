import { useState, useEffect } from 'react';
import { NewsItem } from '@/types/news';

const API_URL = 'https://api.grekland.ru/api/articles';

export const useNews = (category: 'news' = 'news') => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      console.log(`Fetching ${category} items...`);
      const response = await fetch(`${API_URL}?category=${category}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch ${category} items`);
      }

      const data = await response.json();
      console.log(`Received ${category} data:`, data);

      const items = Array.isArray(data) ? data.filter(item => item.category === category) : [];
      console.log(`Filtered ${category} items:`, items);

      setNews(items);
    } catch (err) {
      console.error(`Error fetching ${category} items:`, err);
      setError(err instanceof Error ? err.message : `Произошла ошибка при загрузке ${category === 'news' ? 'новостей' : 'блога'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  return {
    news,
    loading,
    error,
    refreshNews: fetchNews
  };
}; 