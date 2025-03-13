import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { TextStyles, Colors } from '@/theme';

interface RadioButtonProps {
  selected: boolean;
  onSelect: () => void;
  label: string;
}

export const RadioButton = ({ selected, onSelect, label }: RadioButtonProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onSelect}>
      <View style={styles.radioWrapper}>
        <View style={[styles.radio, selected && styles.radioSelected]}>
          {selected && <View style={styles.innerCircle} />}
        </View>
      </View>
      <Text style={[TextStyles.text, styles.label]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    alignItems: 'center',
    
  },
  radioWrapper: {
    marginRight: 8,
  },
  radio: {
    height: 16,
    width: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.purple,
  },
  innerCircle: {
    height: 8,
    width: 8,
    borderRadius: 6,
    backgroundColor: Colors.purple,
  },
  label: {
    paddingTop:4,
    color: Colors.black,
  },
}); 