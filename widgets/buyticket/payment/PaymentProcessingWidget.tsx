import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import Btn from '@/components/ui/btns/Btn';
import { usePaymentProcessing } from '@/hooks/buyticket/usePaymentProcessing';

interface PaymentProcessingWidgetProps {
  bankName?: string;
  paymentId?: string;
}

export const PaymentProcessingWidget: React.FC<PaymentProcessingWidgetProps> = ({ 
  bankName = 'банка',
  paymentId 
}) => {
  const { handleCancel } = usePaymentProcessing(paymentId);

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