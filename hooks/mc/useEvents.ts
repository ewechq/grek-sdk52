import { useState, useEffect, useCallback } from 'react';
import { Event } from '@/types/mc';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
      try {
      setError(null);
        const response = await fetch("https://api.grekland.ru/api/events", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      setError("Ошибка загрузки данных");
      } finally {
        setIsLoading(false);
      }
  }, []);

  // Функция для обновления данных
  const refreshEvents = useCallback(async () => {
    setIsLoading(true);
    await fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, isLoading, error, refresh: refreshEvents };
}; 