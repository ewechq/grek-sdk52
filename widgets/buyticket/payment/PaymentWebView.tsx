/**
 * Виджет для обработки платежей
 * 
 * Разделяет логику оплаты на две платформы:
 * - iOS: Прямой переход в Safari без WebView
 * - Android: Использование WebView для обработки платежной формы
 * 
 * Автоматически выбирает подходящий процессор в зависимости от платформы
 */

import React from 'react';
import { Platform } from 'react-native';
import { AndroidPaymentProcessor } from '../../../utils/buyticket/processors/AndroidPaymentProcessor';
import { IOSPaymentProcessor } from '../../../utils/buyticket/processors/IOSPaymentProcessor';

/**
 * Пропсы для компонента PaymentWebView
 * 
 * @param initialUrl - Начальный URL платежной формы
 */
interface PaymentWebViewProps {
  initialUrl: string;
}

/**
 * Компонент-фасад для обработки платежей
 * Выбирает соответствующий процессор в зависимости от платформы
 */
export const PaymentWebView: React.FC<PaymentWebViewProps> = ({ initialUrl }) => {
  // Выбираем процессор в зависимости от платформы
  if (Platform.OS === 'ios') {
    return <IOSPaymentProcessor initialUrl={initialUrl} />;
  } else {
    return <AndroidPaymentProcessor initialUrl={initialUrl} />;
  }
}; 