import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Colors, TextStyles } from "@/theme";

interface CalendarHeaderProps {
  monthName: string;
  onCalendarPress: () => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({ 
  monthName, 
  onCalendarPress 
}) => (
  <View style={styles.container}>
    <View style={styles.titleContainer}>
      <Text style={styles.title}>Афиша</Text>
      <Text style={styles.monthName}>
        {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
      </Text>
    </View>

    <TouchableOpacity
      style={styles.calendarButton}
      onPress={onCalendarPress}
    >
      <Ionicons
        name="calendar-clear-outline"
        size={18}
        color={Colors.white}
      />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 16,
  },
  titleContainer: {
    gap: 4,
  },
  title: {
    ...TextStyles.h2,
    marginTop: 4,
    textAlign: 'center',
    alignSelf: 'center',
    color: Colors.white,
  },
  monthName: {
    ...TextStyles.textDescription,
    color: Colors.white,
    textAlign: 'center',
    alignSelf: 'center',
  },
  calendarButton: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    position: 'absolute',
    right: 0,
    backgroundColor: Colors.pink,
    borderRadius: 25,
    top:-16,
    zIndex: 100,
  },
}); 