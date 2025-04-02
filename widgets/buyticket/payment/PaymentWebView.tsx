/**
 * Виджет WebView для обработки платежей
 * 
 * Функциональность:
 * 1. Отображение платежной формы
 * 2. Обработка банковских приложений
 * 3. Перехват специальных URL-схем
 * 4. Навигация по статусам платежа
 * 
 * Особенности:
 * - Поддержка основных банковских приложений
 * - Кроссплатформенная обработка (iOS/Android)
 * - Инжекция JavaScript для перехвата событий
 * - Обработка ошибок и fallback-сценарии
 */

import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Platform, Alert, Linking } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useRouter } from 'expo-router';
import * as IntentLauncher from 'expo-intent-launcher';

/**
 * Конфигурация банковских приложений
 * Содержит схемы, пакеты и действия для каждого банка
 */
const BANK_SCHEMES = {
  sberbank: {
    scheme: 'bank100000000008',
    package: 'ru.sberbankmobile',
    action: 'ru.sberbankmobile.android.action.VIEW'
  },
  vtb: {
    scheme: 'bank100000000004',
    package: 'ru.vtb24.mobilebanking.android',
    action: 'android.intent.action.VIEW'
  },
  raiffeisen: {
    scheme: 'bank100000000111',
    package: 'ru.raiffeisen.android',
    action: 'android.intent.action.VIEW'
  },
  gazprombank: {
    scheme: 'bank100000000015',
    package: 'ru.gazprombank.android',
    action: 'android.intent.action.VIEW'
  },
  psb: {
    scheme: 'bank100000000007',
    package: 'ru.psbank.mobile',
    action: 'android.intent.action.VIEW'
  },
  tinkoff: {
    scheme: 'bank100000000001',
    package: 'com.tinkoff.mobile',
    action: 'android.intent.action.VIEW'
  },
  otkritie: {
    scheme: 'bank100000000005',
    package: 'ru.open.mobile.android',
    action: 'android.intent.action.VIEW'
  },
  alfabank: {
    scheme: 'alfabank',
    package: 'ru.alfabank.mobile.android',
    action: 'android.intent.action.VIEW'
  }
};

/**
 * Пропсы для компонента WebView
 * 
 * @param initialUrl - Начальный URL платежной формы
 */
interface PaymentWebViewProps {
  initialUrl: string;
}

export const PaymentWebView: React.FC<PaymentWebViewProps> = ({ initialUrl }) => {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  // Инициализация URL при монтировании
  useEffect(() => {
    if (initialUrl) {
      const decodedUrl = decodeURIComponent(initialUrl).replace(/\\/g, '');
      console.log('Initial Payment URL:', decodedUrl);
      setCurrentUrl(decodedUrl);
    }
  }, [initialUrl]);

  /**
   * Открывает банковское приложение через Intent на Android
   * 
   * @param url - URL для открытия
   * @param bankScheme - Схема банковского приложения
   */
  const openBankAppWithIntent = async (url: string, bankScheme: string) => {
    try {
      const bank = Object.values(BANK_SCHEMES).find(b => b.scheme === bankScheme);
      if (!bank) return false;

      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: url,
        flags: 0x10000000,
        // @ts-ignore
        package: bank.package,
        action: bank.action
      });
      return true;
    } catch (error) {
      console.error('Ошибка при открытии через Intent:', error);
      return false;
    }
  };

  /**
   * Получает имя банка по схеме URL
   */
  const getBankNameByScheme = (scheme: string): string => {
    const bank = Object.entries(BANK_SCHEMES).find(([_, value]) => value.scheme === scheme);
    if (bank) {
      return bank[0].charAt(0).toUpperCase() + bank[0].slice(1);
    }
    return 'банка';
  };

  /**
   * Извлекает ID платежа из URL
   */
  const extractPaymentId = (url: string): string => {
    const match = url.match(/transaction_id[=\/](\d+)/);
    return match ? match[1] : '';
  };

  /**
   * Обработчик изменения состояния навигации WebView
   */
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const url = navState.url;

    // Проверка на банковские схемы
    if (
      url.startsWith('bank') ||
      url.startsWith('sbp://') ||
      Object.values(BANK_SCHEMES).some(bank => url.startsWith(`${bank.scheme}://`))
    ) {
      handleBankAppUrl(url);
      return;
    }

    // Проверка успешной оплаты
    if (url.includes('success') || url.includes('payment_success')) {
      router.replace('/(buyticket)/payment/success');
      return;
    }

    // Проверка ошибки оплаты
    if (url.includes('fail') || url.includes('payment_fail')) {
      router.replace('/(buyticket)/payment/failure');
      return;
    }
  };

  /**
   * Обработчик URL банковских приложений
   */
  const handleBankAppUrl = async (url: string) => {
    try {
      if (url.startsWith('bank') || url.startsWith('sbp://') ||
          Object.values(BANK_SCHEMES).some(bank => url.startsWith(`${bank.scheme}://`))) {

        const urlParts = url.split('://');
        const bankScheme = urlParts[0];
        const bankName = getBankNameByScheme(bankScheme);
        const paymentId = extractPaymentId(url);

        if (Platform.OS === 'android') {
          // Логика для Android
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
          // Логика для iOS
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

  /**
   * JavaScript для инжекции в WebView
   * Перехватывает клики по ссылкам и отправку форм
   */
  const injectedJavaScript = `
    (function() {
      function handleClick(event) {
        var href = event.target.href || event.target.parentElement.href;
        console.log('Клик по ссылке:', href);

        if (href && (
          href.startsWith('bank') ||
          href.startsWith('sbp://') ||
          ${Object.values(BANK_SCHEMES)
            .map(bank => `href.startsWith('${bank.scheme}://')`)
            .join(' || ')}
        )) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'bank_app_url',
            url: href
          }));
          event.preventDefault();
        }
      }

      document.addEventListener('click', handleClick, true);

      // Обработчик форм
      document.addEventListener('submit', function(event) {
        console.log('Отправка формы');
        var form = event.target;
        if (form && form.action && (
          form.action.startsWith('bank') ||
          form.action.startsWith('sbp://') ||
          ${Object.values(BANK_SCHEMES)
            .map(bank => `form.action.startsWith('${bank.scheme}://')`)
            .join(' || ')}
        )) {
          event.preventDefault();
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'bank_app_url',
            url: form.action
          }));
        }
      }, true);

      // Обработка ссылок с target="_blank"
      var links = document.getElementsByTagName('a');
      for (var i = 0; i < links.length; i++) {
        var link = links[i];
        if (link.target === '_blank') {
          link.target = '_self';
        }
      }
    })();
  `;

  if (!currentUrl) {
    return null;
  }

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: currentUrl }}
      style={styles.webview}
      onNavigationStateChange={handleNavigationStateChange}
      onMessage={(event) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.type === 'bank_app_url') {
            handleBankAppUrl(data.url);
          }
        } catch (error) {
          console.error('Ошибка при обработке сообщения:', error);
        }
      }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      scalesPageToFit={true}
      incognito={false}
      injectedJavaScript={injectedJavaScript}
      onError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        // Игнорируем ошибку ERR_UNKNOWN_URL_SCHEME
        if (nativeEvent.description?.includes('ERR_UNKNOWN_URL_SCHEME')) {
          return;
        }
        console.warn('Ошибка WebView:', nativeEvent);
      }}
      onHttpError={(syntheticEvent) => {
        const { nativeEvent } = syntheticEvent;
        console.warn('HTTP ошибка WebView:', nativeEvent);
      }}
    />
  );
};

// Стили компонента
const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
}); 