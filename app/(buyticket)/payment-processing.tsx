import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, TextStyles } from '@/theme';
import Btn from '@/components/ui/btns/Btn';

const PaymentProcessing = () => {
  const router = useRouter();
  const { bankName, paymentId } = useLocalSearchParams<{ bankName: string; paymentId: string }>();

  useEffect(() => {
    // Здесь можно добавить логику проверки статуса платежа
    // Например, периодический опрос API для проверки статуса
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`https://dev.api.grekland.ru/api/ticket/payment/status/${paymentId}`);
        const result = await response.json();

        if (result.status === 'success') {
          router.replace('/success');
        } else if (result.status === 'failed') {
          router.replace('/failure');
        }
        // Если статус pending, продолжаем ожидание
      } catch (error) {
        console.error('Ошибка при проверке статуса платежа:', error);
      }
    };

    // Запускаем проверку каждые 5 секунд
    const interval = setInterval(checkPaymentStatus, 5000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, [paymentId]);

  const handleCancel = () => {
    router.replace('/(buyticket)');
  };

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.purple} style={styles.spinner} />
      
      <Text style={styles.title}>
        Ожидание подтверждения платежа
      </Text>
      
      <Text style={styles.description}>
        Мы ждем подтверждения оплаты от банка. Пожалуйста, завершите операцию в приложении банка.
      </Text>
      
      <Text style={styles.subtitle}>
        Билеты придут к вам на почту в течении ~2 минут по окончанию платежа.
      </Text>

      <View style={styles.buttonContainer}>
        <Btn
          title="Вернуться"
          onPress={handleCancel}
          width="full"
          bgColor={Colors.grayElements}
          textColor={Colors.black}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  spinner: {
    marginBottom: 24
  },
  title: {
    ...TextStyles.h2,
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 16
  },
  description: {
    ...TextStyles.text,
    color: Colors.grayText,
    textAlign: 'center',
    marginBottom: 24
  },
  subtitle: {
    ...TextStyles.text,
    color: Colors.grayText,
    textAlign: 'center',
    marginBottom: 32
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 20
  }
});

export default PaymentProcessing; 