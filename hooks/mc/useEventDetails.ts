/**
 * Хук для получения детальной информации о мастер-классе
 * Используется на странице /mc/[id]
 * 
 * Возвращает:
 * - event: данные мастер-класса
 * - isLoading: статус загрузки
 */

import { useState, useEffect } from 'react';
import { Event } from '@/types/mc';

export const useEventDetails = (id: string | string[]) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const response = await fetch("https://api.grekland.ru/api/events");
        const data = await response.json();
        const item = data.find((item: Event) => item.id === Number(id));
        setEvent(item);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching event detail:", error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchEventDetail();
    }
  }, [id]);

  return { event, isLoading };
}; 