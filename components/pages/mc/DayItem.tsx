import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Pressable } from 'react-native';
import { Typography, Colors } from '@/theme';
import { formatCalendarDay } from '@/utils/mc/dateFormatters';

interface DayItemProps {
  date: Date;
  isSelected: boolean;
  onPress: (date: Date) => void;
}

export const DayItem: React.FC<DayItemProps> = ({
  date,
  isSelected,
  onPress,
}) => {
  const dayOfWeek = formatCalendarDay(date);
  const dayNumber = date.getDate();

  return (
    <Pressable
      onPress={() => onPress(date)}
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
    >
      <Text
        style={[
          styles.weekdayText,
          isSelected && styles.selectedText,
        ]}
      >
        {dayOfWeek}
      </Text>
      <Text
        style={[
          styles.dayText,
          isSelected && styles.selectedText,
        ]}
      >
        {dayNumber}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 50,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  selectedContainer: {
    backgroundColor: Colors.pink,
  },
  weekdayText: {
    ...Typography.small(),
    color: Colors.white,
  },
  dayText: {
    ...Typography.h1(),
    color: Colors.white,
  },
  selectedText: {
    opacity: 1,
  },
}); 