import { useState, useCallback } from 'react';

export const useCalendarState = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  return {
    selectedDate,
    handleDateSelect,
  };
}; 