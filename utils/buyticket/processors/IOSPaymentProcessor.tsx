/**
 * Процессор платежей для iOS
 * 
 * Особенности:
 * - Использует нативный Safari для открытия страницы оплаты
 * - Не использует WebView
 * - Перенаправляет на экран обработки после открытия Safari
 */

import React, { useEffect } from 'react';
import { Alert, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { extractPaymentId } from '../paymentUtils';

/**
 * Пропсы для компонента IOSPaymentProcessor
 * 
 * @param initialUrl - Начальный URL платежной формы
 */
interface IOSPaymentProcessorProps {
  initialUrl: string;
}

export const IOSPaymentProcessor: React.FC<IOSPaymentProcessorProps> = ({ initialUrl }) => {
  const router = useRouter();

  useEffect(() => {
    if (initialUrl) {
      const decodedUrl = decodeURIComponent(initialUrl).replace(/\\/g, '');
      handleIOSPayment(decodedUrl);
    }
  }, [initialUrl]);

  /**
   * Обрабатывает платеж на iOS через Safari
   * 
   * @param url - URL платежной формы
   */
  const handleIOSPayment = async (url: string) => {
    try {
      // Извлекаем параметры платежа
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const paymentId = urlParams.get('payment_id') || extractPaymentId(url);
      const bankName = 'банка'; // Дефолтное значение, так как банк определится в Safari

      // Открываем Safari
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        // Переходим на экран обработки
        router.push({
          pathname: '/(buyticket)/payment/processing',
          params: { bankName, paymentId }
        });
      } else {
        throw new Error('Не удалось открыть Safari');
      }
    } catch (error) {
      Alert.alert(
        'Ошибка',
        'Не удалось открыть страницу оплаты',
        [{ 
          text: 'OK',
          onPress: () => router.replace('/(buyticket)/payment/failure')
        }]
      );
    }
  };

  // Компонент не рендерит UI
  return null;
}; 