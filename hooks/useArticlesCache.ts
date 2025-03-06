import { create } from 'zustand';
import { NewsItem } from '@/types/news';

interface ArticlesState {
  articles: NewsItem[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number;
  fetchArticles: () => Promise<void>;
}

// Время жизни кэша - 5 минут
const CACHE_LIFETIME = 5 * 60 * 1000;

export const useArticlesStore = create<ArticlesState>()((set, get) => ({
  articles: [],
  isLoading: false,
  error: null,
  lastFetch: 0,

  fetchArticles: async () => {
    const now = Date.now();
    const state = get();

    // Проверяем, не устарел ли кэш
    if (state.articles.length > 0 && (now - state.lastFetch) < CACHE_LIFETIME) {
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const response = await fetch('https://api.grekland.ru/api/articles');
      const data = await response.json();
      
      set({ 
        articles: data, 
        isLoading: false,
        lastFetch: now
      });
    } catch (error) {
      set({ 
        error: 'Ошибка при загрузке данных',
        isLoading: false 
      });
    }
  },
})); 