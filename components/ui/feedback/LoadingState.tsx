import { View, StyleSheet } from 'react-native';
import { Colors } from '@/theme';
import { CustomActivityIndicator } from './ActivityIndicator';

interface LoadingStateProps {
  loading?: boolean;
}

export const LoadingState = ({ loading }: LoadingStateProps) => {
  if (!loading) return null;
  
  return (
    <View style={styles.centered}>
      <CustomActivityIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});