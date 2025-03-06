import React from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Colors, TextStyles } from '@/theme';

interface LoadingStateProps {
  loading?: boolean;
  error?: string | null;
  color?: string;
  backgroundColor?: string;
}

export const LoadingState = ({ 
  loading, 
  error, 
  color = Colors.purple,
  backgroundColor = Colors.white 
}: LoadingStateProps) => {
  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" color={color} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    ...TextStyles.text,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
}); 