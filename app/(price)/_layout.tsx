import { Stack } from 'expo-router';
import { Colors } from '@/theme';

export default function PayByCardLayout() {
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
    </Stack>
  );
}