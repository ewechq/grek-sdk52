/**
 * Виджет обработки платежа
 * 
 * Функциональность:
 * 1. Отображение статуса обработки платежа
 * 2. Индикация загрузки
 * 3. Возможность отмены операции
 * 4. Информация о времени получения билетов
 * 
 * Особенности:
 * - Адаптивный дизайн
 * - Индикатор загрузки
 * - Информативные сообщения
 * - Кнопка отмены операции
 */

import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import Btn from '@/components/ui/btns/Btn';
import { usePaymentProcessing } from '@/hooks/buyticket/usePaymentProcessing';

/**
 * Пропсы для компонента обработки платежа
 * 
 * @param bankName - Название банка (по умолчанию "банка")
 * @param paymentId - ID платежа
 */
interface PaymentProcessingWidgetProps {
  bankName?: string;
  paymentId?: string;
}

export const PaymentProcessingWidget: React.FC<PaymentProcessingWidgetProps> = ({ 
  bankName = 'банка',
  paymentId 
}) => {
  // Использование хука для обработки платежа
  const { handleCancel } = usePaymentProcessing(paymentId);

  return (
    <View style={styles.container}>
      {/* Индикатор загрузки */}
      <ActivityIndicator size="large" color={Colors.purple} style={styles.spinner} />
      
      {/* Заголовок */}
      <Text style={styles.title}>
        Ожидание подтверждения платежа
      </Text>
      
      {/* Описание процесса */}
      <Text style={styles.description}>
        Мы ждем подтверждения оплаты от банка. Пожалуйста, завершите операцию в приложении банка.
      </Text>
      
      {/* Информация о времени получения билетов */}
      <Text style={styles.subtitle}>
        Билеты придут к вам на почту в течении ~2 минут по окончанию платежа.
      </Text>

      {/* Кнопка отмены */}
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

// Стили компонента
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