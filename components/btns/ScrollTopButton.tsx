import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/theme";

interface ScrollTopButtonProps {
  onPress: () => void;
}

export const ScrollTopButton: React.FC<ScrollTopButtonProps> = ({ onPress }) => (
  <TouchableOpacity 
    style={styles.scrollTopButton}
    onPress={onPress}
  >
    <Ionicons 
      name="arrow-up" 
      size={24} 
      color={Colors.white}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  scrollTopButton: {
    position: 'absolute',
    bottom: 120,
    right: 16,
    width: 55,
    height: 55,
    borderRadius: 25,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',

  },
}); 