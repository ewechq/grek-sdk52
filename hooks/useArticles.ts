import { useState, useEffect } from 'react';
import { Article } from '@/types/articles';

export const useArticles = (limit?: number) => {
  const [news, setNews] = useState<Article[]>([]);
  const [blog, setBlog] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('https://api.grekland.ru/api/articles');
        const data = await response.json();
        
        // Фильтруем только по обязательным полям title и introtext
        const validNewsArticles = data
          .filter((article: Article) => 
            article.category === 'news' && 
            article.title && 
            article.introtext
          );
        
        const validBlogArticles = data
          .filter((article: Article) => 
            article.category === 'blog' && 
            article.title && 
            article.introtext
          );
      
        
        setNews(limit ? validNewsArticles.slice(0, limit) : validNewsArticles);
        setBlog(limit ? validBlogArticles.slice(0, limit) : validBlogArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [limit]);

  return { news, blog, isLoading };
}; 