import React, { useCallback, useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { CalendarHeader } from '@/components/pages/mc/CalendarHeader';
import { DayItem } from '@/components/pages/mc/DayItem';
import { generateDays, formatMonthName } from '@/utils/mc/dateUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const flatListRef = useRef<FlatList>(null);
  const monthName = formatMonthName(selectedDate);
  const days = generateDays(selectedDate);

  const scrollToSelectedDate = useCallback(() => {
    if (flatListRef.current) {
      const dayWidth = 60; // Примерная ширина элемента дня
      const screenCenter = SCREEN_WIDTH / 2;
      const selectedIndex = days.findIndex(
        date => date.toDateString() === selectedDate.toDateString()
      );
      
      if (selectedIndex !== -1) {
        const scrollPosition = (selectedIndex * dayWidth) - (screenCenter - dayWidth / 2);
        flatListRef.current.scrollToOffset({
          offset: Math.max(0, scrollPosition),
          animated: true
        });
      }
    }
  }, [selectedDate, days]);

  useEffect(() => {
    scrollToSelectedDate();
  }, [selectedDate, scrollToSelectedDate]);

  const renderItem = useCallback(({ item }: { item: Date }) => (
    <DayItem
      date={item}
      isSelected={selectedDate.toDateString() === item.toDateString()}
      onPress={onDateSelect}
    />
  ), [selectedDate, onDateSelect]);

  return (
    <View style={styles.container}>
      <CalendarHeader
        monthName={monthName}
      />

      <View style={styles.daysContainer}>
        <FlatList
          ref={flatListRef}
          horizontal
          data={days}
          keyExtractor={(item) => item.toDateString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  daysContainer: {
    marginTop: 16,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
}); 