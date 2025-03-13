import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import { normalize } from '@/utils/responsive';

export const DateWarning = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚠️</Text>
      <Text style={styles.text}>
        Сейчас билеты можно приобрести только на текущую дату
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: normalize(40),
    marginHorizontal: normalize(16),
    backgroundColor: Colors.grayBg,
    borderRadius: normalize(25),
    padding: normalize(16),
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(16),
    paddingHorizontal: normalize(16)
  },
  icon: {
    fontSize: 16
  },
  text: {
    ...TextStyles.h3,
    color: Colors.black,
    paddingRight: normalize(16)
  }
}); 