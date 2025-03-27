import { View, Text, StyleSheet } from 'react-native';
import { Colors, TextStyles } from '@/theme';

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <View style={styles.centered}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    paddingTop: 100,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  message: {
    color: Colors.black,
    ...TextStyles.text,
  },
});