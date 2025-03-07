import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Colors } from '@/theme';
import { CalendarHeader } from '@/components/pages/mc/CalendarHeader';
import { DayItem } from '@/components/pages/mc/DayItem';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const monthName = selectedDate.toLocaleDateString("ru-RU", { month: "long" });

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
          horizontal
          data={generateDays(selectedDate)}
          keyExtractor={(item) => item.toDateString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const generateDays = (centerDate: Date): Date[] => {
  const days: Date[] = [];
  for (let i = -5; i <= 5; i++) {
    const date = new Date(centerDate);
    date.setDate(centerDate.getDate() + i);
    days.push(date);
  }
  return days;
};

const styles = StyleSheet.create({
  container: {},
  daysContainer: {
    paddingVertical: 20,
    zIndex: 2,
  },
  flatListContent: {
    paddingHorizontal: 12,
  },
}); 