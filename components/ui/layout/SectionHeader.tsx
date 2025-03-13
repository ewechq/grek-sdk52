import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, TextStyles } from '@/theme';

interface SectionHeaderProps {
  title: string;
  onPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.header} 
      onPress={onPress} 
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <Text style={TextStyles.h2}>{title}</Text>
      {onPress && <Ionicons name="chevron-forward-outline" size={16} color={Colors.grayText} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
}); 