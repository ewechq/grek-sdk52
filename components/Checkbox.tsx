import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';

interface CheckboxProps {
  checked: boolean;
  onCheck: () => void;
  label: string;
}

export const Checkbox = ({ checked, onCheck, label }: CheckboxProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onCheck}>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked && (
          <Ionicons name="checkmark" size={16} color={Colors.white} />
        )}
      </View>
      <Text style={[TextStyles.text, styles.label]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,

  },
  checkboxChecked: {
    backgroundColor: Colors.purple,
    borderColor: Colors.purple,
  },
  label: {
    flex: 1,
    color: Colors.black,
    paddingTop:2,
  },
}); 