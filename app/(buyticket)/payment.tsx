import React from 'react';
import { StyleSheet } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';

const PaymentScreen = () => {
  const router = useRouter();
  const { url } = useLocalSearchParams<{ url: string }>();

  if (!url) {
    router.back();
    return null;
  }

  // Очищаем URL от экранированных слешей и декодируем
  const cleanUrl = decodeURIComponent(url).replace(/\\/g, '');
  
  console.log('Payment URL:', cleanUrl); // Для отладки

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    console.log('Navigation state:', navState);

    // Проверяем только успешную оплату
    if (navState.url.includes('success') || navState.url.includes('payment_success')) {
      router.replace('/success');
      return;
    }
  };

  return (
    <WebView
      source={{ uri: cleanUrl }}
      style={styles.webview}
      onNavigationStateChange={handleNavigationStateChange}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      scalesPageToFit={true}
      incognito={true}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView error:', nativeEvent);
        router.replace('/failure');
      }}
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('WebView HTTP error:', nativeEvent);
        router.replace('/failure');
      }}
      onLoadError={(syntheticEvent: any) => {
        console.warn('WebView load error:', syntheticEvent.nativeEvent);
        router.replace('/failure');
      }}
      userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
    />
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});

export default PaymentScreen;
