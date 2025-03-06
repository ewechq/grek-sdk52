import { useState, useEffect } from 'react';
import { NewsItem, NewsResponse } from '@/types/news';

const API_URL = 'https://api.grekland.ru/api/articles';

export const useBlogs = () => {
  const [blogs, setBlogs] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }

      const data = await response.json();
      const allItems = Array.isArray(data) ? data : data.data || [];
      const blogItems = allItems.filter((item: NewsItem) => item.category === 'blog');
      setBlogs(blogItems);
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке блога');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return {
    blogs,
    loading,
    error,
    refreshBlogs: fetchBlogs
  };
}; 