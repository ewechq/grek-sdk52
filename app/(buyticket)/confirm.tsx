import { View, Text } from 'react-native';
import { router } from 'expo-router';
import Btn from '@/components/btns/Btn';
import { Colors } from '@/theme';
export default function ConfirmTicket() {
  return (
    <View>
      <Text>Подтверждение заказа</Text>
      <Btn 
        title="Перейти к оплате" 
        onPress={() => router.push('/(buyticket)/payment')}
        bgColor={Colors.purple}
      />
    </View>
  );
}