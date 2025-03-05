import { useState, useEffect, useCallback } from 'react';
import { VisibleDatesState } from '@/types/mc';

export const useVisibleDates = (initialDate: Date) => {
  const [{ dates, isLoading }, setState] = useState<VisibleDatesState>({
    dates: [initialDate],
    isLoading: false,
  });

  const loadMoreDates = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setState(prev => {
      const lastDate = prev.dates[prev.dates.length - 1];
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 1);
      
      return {
        dates: [...prev.dates, nextDate],
        isLoading: false,
      };
    });
  }, []);

  useEffect(() => {
    setState({ dates: [initialDate], isLoading: false });
  }, [initialDate]);

  return {
    visibleDates: dates,
    isLoadingMore: isLoading,
    loadMoreDates,
  };
}; 