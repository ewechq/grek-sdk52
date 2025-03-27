import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/theme';
import { PaymentProcessingWidget } from '@/widgets/buyticket/payment/PaymentProcessingWidget';

const PaymentProcessing = () => {
  const { bankName, paymentId } = useLocalSearchParams<{ bankName: string; paymentId: string }>();

  return (
    <View style={styles.container}>
      <PaymentProcessingWidget bankName={bankName} paymentId={paymentId} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default PaymentProcessing; 