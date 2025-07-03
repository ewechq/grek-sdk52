import { Stack } from 'expo-router';
import { Colors } from '@/theme';

export default function BuyTicketLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.black,
        headerShown: true,
        headerLeft: () => null,
        headerTitle: () => null,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="payment"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}