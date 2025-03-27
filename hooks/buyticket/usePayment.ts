import { useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { Platform, Alert, Linking } from 'react-native';

import { 
  openBankAppWithIntent,
  getBankNameByScheme, 
  extractPaymentId,
  isBankAppUrl,
  isSuccessPaymentUrl,
  isFailurePaymentUrl
} from '@/utils/buyticket/paymentUtils';

export const usePayment = () => {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  const handleBankAppUrl = async (url: string) => {
    try {
      if (isBankAppUrl(url)) {
        // Извлекаем схему банковского приложения
        const urlParts = url.split('://');
        const bankScheme = urlParts[0];
        const bankName = getBankNameByScheme(bankScheme);
        const paymentId = extractPaymentId(url);
        
        if (Platform.OS === 'android') {
          // На Android используем IntentLauncher
          const opened = await openBankAppWithIntent(url, bankScheme);
          if (opened) {
            router.push({
              pathname: '/(buyticket)/payment/processing',
              params: { bankName, paymentId }
            });
          } else {
            Alert.alert(
              'Ошибка',
              'Не удалось открыть банковское приложение',
              [{ text: 'OK' }]
            );
          }
        } else {
          const canOpen = await Linking.canOpenURL(url);
          if (canOpen) {
            await Linking.openURL(url);
            router.push({
              pathname: '/(buyticket)/payment/processing',
              params: { bankName, paymentId }
            });
          } else {
            Alert.alert(
              'Открытие приложения банка',
              'Для продолжения оплаты, нажмите "Открыть в браузере"',
              [
                { 
                  text: 'Открыть в браузере', 
                  onPress: async () => {
                    const browserUrl = url.replace(/^bank\d+:\/\//, 'https://');
                    await Linking.openURL(browserUrl);
                    router.push({
                      pathname: '/(buyticket)/payment/processing',
                      params: { bankName, paymentId }
                    });
                  }
                },
                { 
                  text: 'Отмена',
                  style: 'cancel'
                }
              ]
            );
          }
        }
      } else {
        setCurrentUrl(url);
      }
    } catch (error) {
      console.error('Ошибка при обработке платежа:', error);
      Alert.alert(
        'Ошибка',
        'Произошла ошибка при обработке платежа',
        [{ text: 'OK' }]
      );
    }
  };

  const handleNavigationStateChange = (navState: { url: string }) => {
    const url = navState.url;

    // Проверяем URL на специальные схемы банковских приложений
    if (isBankAppUrl(url)) {
      handleBankAppUrl(url);
      return;
    }

    // Проверяем успешную оплату
    if (isSuccessPaymentUrl(url)) {
      router.replace('/(buyticket)/payment/success');
      return;
    }

    // Проверяем ошибку оплаты
    if (isFailurePaymentUrl(url)) {
      router.replace('/(buyticket)/payment/failure');
      return;
    }
  };

  return {
    webViewRef,
    currentUrl,
    setCurrentUrl,
    handleNavigationStateChange,
    handleBankAppUrl
  };
}; 