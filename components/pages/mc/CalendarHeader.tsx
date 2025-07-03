import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography, Colors } from '@/theme';

interface CalendarHeaderProps {
  monthName: string;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  monthName,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Афиша мероприятий</Text>
          <Text style={styles.monthName}>
            {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    position: 'relative',
    overflow: 'hidden',
  },

  content: {
    paddingHorizontal: 16,
  },
  titleContainer: {
    gap: 4,
    alignItems: 'center',
  },
  title: {
    ...Typography.h2(),
    color: Colors.white,
    textTransform:'uppercase',
  },
  monthName: {
    ...Typography.caption(),
    color: Colors.white,
  },
}); 