import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { FlatList } from 'react-native';
import { CalendarState } from '@/types/mc';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export const useCalendarNavigation = () => {
  const flatListRef = useRef<FlatList>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    const today = new Date();
    const daysArray: Date[] = [];
    
    for (let i = -5; i <= 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      daysArray.push(date);
    }
    
    setDays(daysArray);
    scrollToSelectedDate(today, false);
  }, []);

  const scrollToSelectedDate = useCallback((date: Date, animated: boolean = true) => {
    const index = days.findIndex(
      (day) => day.toDateString() === date.toDateString()
    );
    
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated,
        viewPosition: 0.5,
      });
    }
  }, [days]);

  return {
    selectedDate,
    flatListRef,
    days,
    scrollToSelectedDate,
    setSelectedDate,
  };
}; 