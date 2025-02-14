import { useState, useEffect } from 'react';
import { Article } from '@/types/articles';

export const useArticles = () => {
  const [news, setNews] = useState<Article[]>([]);
  const [blog, setBlog] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://api.grekland.ru/api/articles');
        const data = await response.json();
        
        const newsArticles = data.filter((article: Article) => article.category === 'news');
        const blogArticles = data.filter((article: Article) => article.category === 'blog');
        
        setNews(newsArticles);
        setBlog(blogArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return { news, blog, isLoading };
}; 