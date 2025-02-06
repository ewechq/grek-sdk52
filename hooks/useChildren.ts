import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface Child {
  id: number;
  name: string;
  birth_date: string;
  gk_id: number | null;
  sms_code: string | null;
  agreement: number;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export const useChildren = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChildren = async () => {
    try {
      setLoading(true);
      
      // Получаем токен из SecureStore вместо AsyncStorage
      const token = await SecureStore.getItemAsync('authToken');
      
      if (!token) {
        throw new Error('Не найден токен авторизации');
      }

      const response = await fetch('https://api.grekland.ru/api/children', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Необходима авторизация');
        }
        throw new Error('Ошибка при получении данных');
      }

      const data = await response.json();
      setChildren(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
      console.error('Error fetching children:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  return { children, loading, error, refetch: fetchChildren };
}; 