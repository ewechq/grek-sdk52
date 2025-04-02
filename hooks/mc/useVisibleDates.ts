import { useState, useEffect, useCallback } from 'react';
import { VisibleDatesState } from '@/types/mc';

const DAYS_TO_LOAD = 7; // Загружаем неделю за раз

export const useVisibleDates = (initialDate: Date) => {
  const [{ dates, isLoading }, setState] = useState<VisibleDatesState>({
    dates: [initialDate],
    isLoading: false,
  });

  // Функция для получения массива дат
  const getDateRange = (startDate: Date, daysCount: number) => {
    const result = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < daysCount; i++) {
      result.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return result;
  };

  const loadMoreDates = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setState(prev => {
      const lastDate = prev.dates[prev.dates.length - 1];
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const newDates = getDateRange(nextDate, DAYS_TO_LOAD);
      
      return {
        dates: [...prev.dates, ...newDates],
        isLoading: false,
      };
    });
  }, []);

  useEffect(() => {
    // При изменении начальной даты загружаем неделю
    const initialDates = getDateRange(initialDate, DAYS_TO_LOAD);
    setState({ dates: initialDates, isLoading: false });
  }, [initialDate]);

  return {
    visibleDates: dates,
    isLoadingMore: isLoading,
    loadMoreDates,
  };
}; 