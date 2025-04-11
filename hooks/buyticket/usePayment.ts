import { useState, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { Platform, Alert, Linking } from 'react-native';

import { 
  isSuccessUrl,
  isFailureUrl
} from '@/utils/buyticket/paymentUtils';

export const usePayment = () => {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [lastError, setLastError] = useState<string | null>(null);
  const [processingUrl, setProcessingUrl] = useState<string | null>(null);
  const [lastPaymentAttempt, setLastPaymentAttempt] = useState<number>(0);
  const PAYMENT_COOLDOWN = 5000; // 5 секунд между попытками

  const logPaymentFlow = (step: string, data?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Payment Flow - ${step}:`, data || '');
  };

  const handlePaymentUrl = async (url: string) => {
    try {
      // Проверяем временной интервал между попытками
      const now = Date.now();
      if (now - lastPaymentAttempt < PAYMENT_COOLDOWN) {
        logPaymentFlow('Payment attempt too soon', { 
          timeSinceLastAttempt: now - lastPaymentAttempt,
          requiredCooldown: PAYMENT_COOLDOWN 
        });
        Alert.alert(
          'Внимание',
          'Пожалуйста, подождите несколько секунд перед следующей попыткой оплаты.',
          [{ text: 'OK' }]
        );
        return;
      }

      if (processingUrl === url) {
        logPaymentFlow('Duplicate URL processing prevented', { url });
        return;
      }
      
      setProcessingUrl(url);
      setLastPaymentAttempt(now);
      logPaymentFlow('handlePaymentUrl - start', { url });

      // Извлекаем параметры из URL
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const paymentId = urlParams.get('payment_id') || 'unknown';
      const amount = urlParams.get('amount') || '0';
      const currency = urlParams.get('currency') || 'RUB';

      // Формируем универсальную ссылку СБП
      const sbpUrl = `https://qr.nspk.ru/AS${paymentId}?type=02&bank=100000000008&sum=${amount}&cur=${currency}`;
      
      logPaymentFlow('Generated SBP URL', { sbpUrl });

      // Проверяем возможность открытия URL
      const canOpen = await Linking.canOpenURL(sbpUrl);
      logPaymentFlow('URL check result', { canOpen, sbpUrl });

      if (canOpen) {
        await Linking.openURL(sbpUrl);
        logPaymentFlow('SBP URL opened successfully');
        
        // Переходим на страницу обработки
        router.push({
          pathname: '/(buyticket)/payment/processing',
          params: { 
            bankName: 'Сбербанк',
            paymentId,
            amount,
            currency
          }
        });
      } else {
        throw new Error('Не удалось открыть страницу оплаты');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Payment processing error:', error);
      logPaymentFlow('Error in handlePaymentUrl', { error: errorMessage });
      setLastError(errorMessage);
      
      Alert.alert(
        'Ошибка',
        'Произошла ошибка при обработке платежа. Попробуйте позже.',
        [{ 
          text: 'OK',
          onPress: () => router.replace('/(buyticket)/payment/failure')
        }]
      );
    } finally {
      setProcessingUrl(null);
    }
  };

  const handleNavigationStateChange = (navState: { url: string }) => {
    const url = navState.url;
    logPaymentFlow('Navigation state changed', { url });

    try {
      if (isSuccessUrl(url)) {
        logPaymentFlow('Success URL detected');
        router.replace('/(buyticket)/payment/success');
        return;
      }

      if (isFailureUrl(url)) {
        logPaymentFlow('Failure URL detected');
        router.replace('/(buyticket)/payment/failure');
        return;
      }

      // Если URL содержит параметры платежа, обрабатываем его
      if (url.includes('payment_id') || url.includes('amount')) {
        logPaymentFlow('Payment URL detected', { url });
        handlePaymentUrl(url);
        return;
      }

      logPaymentFlow('Setting current URL', { url });
      setCurrentUrl(url);
    } catch (error) {
      console.error('Navigation state change error:', error);
      logPaymentFlow('Navigation error', { error });
    }
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      logPaymentFlow('WebView message received', { type: data.type, data });
      
      switch (data.type) {
        case 'click_event':
          logPaymentFlow('Click event received', data);
          if (data.href && (data.href.includes('payment_id') || data.href.includes('amount'))) {
            handlePaymentUrl(data.href);
          }
          break;
          
        case 'url_change':
          logPaymentFlow('URL change detected', data);
          break;
          
        case 'js_error':
          logPaymentFlow('JavaScript error', data);
          if (data.message && !data.message.includes('Script error.')) {
            setLastError(`JavaScript Error: ${data.message}`);
          }
          break;
          
        case 'fetch_error':
          logPaymentFlow('Fetch error', data);
          setLastError(`Network Error: ${data.error}`);
          break;
          
        case 'payment_error':
          logPaymentFlow('Payment error from WebView', { message: data.message });
          setLastError(data.message);
          router.replace('/(buyticket)/payment/failure');
          break;
          
        case 'page_error':
          logPaymentFlow('Page error from WebView', { message: data.message });
          setLastError(data.message);
          if (data.message.includes('платеж') || data.message.includes('payment')) {
            router.replace('/(buyticket)/payment/failure');
          }
          break;

        case 'form_submit':
          logPaymentFlow('Form submission detected', data);
          if (data.action && (data.action.includes('payment_id') || data.action.includes('amount'))) {
            handlePaymentUrl(data.action);
          }
          break;
          
        default:
          logPaymentFlow('Unknown message type', { type: data.type, data });
      }
    } catch (error) {
      console.error('Message handling error:', error);
      logPaymentFlow('Message parsing error', { error });
    }
  };

  return {
    webViewRef,
    currentUrl,
    setCurrentUrl,
    handleNavigationStateChange,
    handleMessage,
    lastError
  };
}; 