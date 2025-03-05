import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme';

interface ScrollToTopProps {
  visible: boolean;
  onPress: () => void;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  visible,
  onPress,
}) => {
  if (!visible) return null;

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={onPress}
    >
      <Ionicons 
        name="arrow-up" 
        size={24} 
        color={Colors.white}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
}); 