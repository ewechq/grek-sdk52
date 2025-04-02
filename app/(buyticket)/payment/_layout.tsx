import { Stack } from 'expo-router';
import { Colors } from '@/theme';
import { useRouter } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function PaymentLayout() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/(buyticket)");
  };

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen 
        name="index"
      />
      <Stack.Screen 
        name="success"
      />
      <Stack.Screen 
        name="failure"
      />
      <Stack.Screen 
        name="processing"
      />
      <Stack.Screen 
        name="sms"
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 16,
  },
}); 