import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { TextStyles, Colors } from '@/theme';

interface ToggleButtonProps {
  title: string;
  isSelected: boolean;
  onToggle: () => void;
  activeBackgroundColor?: string;
  activeTextColor?: string;
  defaultBackgroundColor?: string;
  defaultTextColor?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  title,
  isSelected,
  onToggle,
  activeBackgroundColor = Colors.purple,
  activeTextColor = Colors.white,
  defaultBackgroundColor = Colors.grayElements,
  defaultTextColor = Colors.black,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { 
          backgroundColor: isSelected 
            ? activeBackgroundColor 
            : defaultBackgroundColor 
        }
      ]}
      onPress={onToggle}
    >
      <Text
        style={[
          styles.text,
          { 
            color: isSelected 
              ? activeTextColor 
              : defaultTextColor 
          }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    ...TextStyles.h3,
  },
});

export default ToggleButton; 