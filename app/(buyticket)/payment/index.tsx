import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/theme';
import { PaymentWebView } from '@/widgets/buyticket/payment/PaymentWebView';

const PaymentScreen = () => {
  const router = useRouter();
  const { url } = useLocalSearchParams<{ url: string }>();

  if (!url) {
    router.back();
    return null;
  }

  return (
    <View style={styles.container}>
      <PaymentWebView initialUrl={url as string} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default PaymentScreen; 