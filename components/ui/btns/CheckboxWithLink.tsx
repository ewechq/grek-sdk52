import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography} from '@/theme';

interface CheckboxWithLinkProps {
  checked: boolean;
  onCheck: () => void;
  label: string;
  url: string;
}

export const CheckboxWithLink: React.FC<CheckboxWithLinkProps> = ({
  checked,
  onCheck,
  label,
  url
}) => {
  const handleLinkPress = () => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.checkboxContainer} 
        onPress={onCheck}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && (
            <Ionicons name="checkmark" size={12} color={Colors.black} />
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          Согласен(а) с{' '}
          <Text style={styles.link} onPress={handleLinkPress}>
            {label}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  checkboxContainer: {
    paddingLeft: 4,
    transform: [{ scale: 1.5 }],
  },
  checkbox: {
    height: 20,
    width: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  labelContainer: {
    flex: 1,
  },
  label: {
    ...Typography.caption(),
    color: Colors.black,
    paddingTop: 2,
    paddingLeft: 16,
  },
  link: {
    textDecorationLine: 'underline',
    color: Colors.black,
  },
}); 