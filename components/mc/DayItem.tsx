import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TextStyles, Colors } from '@/theme';

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
  const dayOfWeek = date.toLocaleDateString("ru-RU", { weekday: "short" });
  const dayNumber = date.getDate();

  return (
    <TouchableOpacity
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 15,
    marginBottom: 8,
  },
  selectedContainer: {
    backgroundColor: Colors.pink,
  },
  weekdayText: {
    ...TextStyles.textDescription,
    color: Colors.white,
  },
  dayText: {
    ...TextStyles.h1,
    color: Colors.white,
  },
  selectedText: {
    opacity: 1,
  },
}); 