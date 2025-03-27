import { View, Text, StyleSheet } from 'react-native';
import { Colors, TextStyles } from '@/theme';

interface ErrorStateProps {
  message: string;
}

export const ErrorState = ({ message }: ErrorStateProps) => {
  return (
    <View style={styles.centered}>
      <Text style={styles.error}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  error: {
    color: Colors.red,
    ...TextStyles.text,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});