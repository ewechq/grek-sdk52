import { Stack } from 'expo-router';
import { Colors } from '@/theme';
import { useRouter } from 'expo-router';
import HeaderInner from '@/components/ui/layout/Header';

export default function BuyTicketLayout() {
  const router = useRouter();

  const handleGoBack = () => {
    router.replace("/");
  };

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