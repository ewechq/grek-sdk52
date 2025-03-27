import { Stack } from 'expo-router';
import { Colors } from '@/theme';
import { useRouter } from 'expo-router';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentLayout() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/(buyticket)");
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
            style={styles.backButton}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={Colors.black} 
            />
          </TouchableOpacity>
        ),
        headerShadowVisible: false,
        headerTitle: "Оплата",
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="success"
        options={{
          headerTitle: "Успешная оплата",
        }}
      />
      <Stack.Screen 
        name="failure"
        options={{
          headerTitle: "Ошибка оплаты",
        }}
      />
      <Stack.Screen 
        name="processing"
        options={{
          headerTitle: "Обработка платежа",
        }}
      />
      <Stack.Screen 
        name="sms"
        options={{
          headerTitle: "Подтверждение",
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 16,
  },
}); 