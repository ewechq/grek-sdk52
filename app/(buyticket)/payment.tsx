import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import WebBrowser from '@/components/WebBrowser';

const PaymentScreen = () => {
  const { url } = useLocalSearchParams<{ url: string }>();

  if (!url) {
    return null;
  }

  return <WebBrowser url={url} />;
};

export default PaymentScreen;
