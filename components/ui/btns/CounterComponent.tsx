import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import AntDesign from '@expo/vector-icons/AntDesign';

interface CounterProps {
  label: string;
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
  unit?: string;
  decreaseButtonColor?: string;
  increaseButtonColor?: string;
  decreaseIconColor?: string;
  increaseIconColor?: string;
}

const Counter: React.FC<CounterProps> = ({
  label,
  value,
  onIncrease,
  onDecrease,
  unit,
  decreaseButtonColor = Colors.grayElements,
  increaseButtonColor = Colors.green,
  decreaseIconColor = Colors.black,
  increaseIconColor = Colors.black,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.controls}>
        <TouchableOpacity 
          onPress={onDecrease} 
          style={[
            styles.button,
            { backgroundColor: decreaseButtonColor }
          ]}
          disabled={value === 0}
        >
          <AntDesign name="minus" size={16} color={decreaseIconColor} />
        </TouchableOpacity>
        <Text style={styles.value}>
          {value}
          {unit && <Text style={styles.unit}>{` ${unit}`}</Text>}
        </Text>
        <TouchableOpacity 
          onPress={onIncrease} 
          style={[
            styles.button,
            { backgroundColor: increaseButtonColor }
          ]}
        >
          <AntDesign name="plus" size={16} color={increaseIconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  label: {
    ...TextStyles.text,
    color: Colors.black,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    ...TextStyles.h2,
    color: Colors.black,
    minWidth: 24,
    textAlign: 'center',
    flexDirection: 'row',
  },
  unit: {
    ...TextStyles.h2,
    color: Colors.black,
  },
});

export default Counter; 