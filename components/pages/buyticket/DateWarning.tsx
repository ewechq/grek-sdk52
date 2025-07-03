import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography, Colors } from '@/theme';

export const DateWarning = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.text}>
        Время для покупки билетов: с 6:00 до 20:00.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 40,
    marginHorizontal: 16,
    backgroundColor: Colors.grayBg,
    borderRadius: 25,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingHorizontal: 16,
    maxWidth: '100%',
    flexWrap: 'wrap',
  },
  icon: {
    fontSize: 16,
    marginTop: 4
  },
  text: {
    ...Typography.caption(),
    color: Colors.black,
    flex: 1,
    flexShrink: 1,
    flexWrap: 'wrap',
    minWidth: 0,
  }
}); 