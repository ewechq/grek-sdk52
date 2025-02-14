import { Stack } from 'expo-router';
import { Colors } from '@/theme';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
        headerLeft: () => (
          <TouchableOpacity 
            onPress={handleGoBack}
            style={{ marginLeft: 16 }}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={Colors.black} 
            />
          </TouchableOpacity>
        ),
        headerShadowVisible: false,
        headerTitle: "",
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="confirm"
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