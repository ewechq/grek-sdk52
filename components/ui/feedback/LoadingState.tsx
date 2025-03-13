import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { Colors } from '@/theme';

interface LoadingStateProps {
  loading?: boolean;
}

export const LoadingState = ({ loading }: LoadingStateProps) => {
  if (!loading) return null;
  
  return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color={Colors.purple} />
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