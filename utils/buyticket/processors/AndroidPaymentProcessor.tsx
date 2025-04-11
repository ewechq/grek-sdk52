/**
 * Процессор платежей для Android
 * 
 * Особенности:
 * - Использует WebView для отображения платежной формы
 * - Обрабатывает банковские приложения через Intent
 * - Перехватывает специальные URL-схемы
 * - Отслеживает состояние приложения
 */

import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Alert, BackHandler, AppState, View } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useRouter } from 'expo-router';
import * as IntentLauncher from 'expo-intent-launcher';
import { 
  BANK_SCHEMES, 
  extractPaymentId, 
  getBankNameByScheme, 
  isBankAppUrl,
  isSuccessUrl,
  isFailureUrl
} from '../paymentUtils';

/**
 * Пропсы для компонента AndroidPaymentProcessor
 * 
 * @param initialUrl - Начальный URL платежной формы
 */
interface AndroidPaymentProcessorProps {
  initialUrl: string;
}

export const AndroidPaymentProcessor: React.FC<AndroidPaymentProcessorProps> = ({ initialUrl }) => {
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState('');
  const [lastBankAppOpen, setLastBankAppOpen] = useState<number>(0);
  const [canInteract, setCanInteract] = useState(true);
  const [activePayment, setActivePayment] = useState<{bankScheme: string, url: string, paymentId: string} | null>(null);
  const [lastAppState, setLastAppState] = useState(AppState.currentState);

  // Отслеживание состояния приложения
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (lastAppState === 'background' && nextAppState === 'active') {
        setCanInteract(true);
        setActivePayment(null);
      }
      setLastAppState(nextAppState);
    });

    return () => {
      subscription.remove();
    };
  }, [lastAppState]);

  useEffect(() => {
    if (initialUrl) {
      const decodedUrl = decodeURIComponent(initialUrl).replace(/\\/g, '');
      setCurrentUrl(decodedUrl);
    }
  }, [initialUrl]);

  // Автоматический сброс блокировки через таймаут
  useEffect(() => {
    if (!canInteract) {
      const timer = setTimeout(() => {
        setCanInteract(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [canInteract]);

  // Обработка возврата из банковского приложения
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      setCanInteract(true);
      setActivePayment(null);
      return false;
    });

    return () => backHandler.remove();
  }, []);

  /**
   * Открывает банковское приложение через Intent
   * 
   * @param url - URL платежа
   * @param bankScheme - Схема банка
   * @returns true, если приложение успешно открыто
   */
  const openBankAppWithIntent = async (url: string, bankScheme: string) => {
    try {
      const paymentId = extractPaymentId(url);

      if (activePayment && activePayment.paymentId === paymentId) {
        Alert.alert(
          'Внимание',
          'Процесс оплаты уже запущен. Пожалуйста, завершите текущую операцию или нажмите "Назад" для отмены.',
          [{
            text: 'OK',
            onPress: () => {
              setCanInteract(true);
            }
          }]
        );
        return false;
      }

      const now = Date.now();
      if (now - lastBankAppOpen < 1000) {
        return false;
      }

      setLastBankAppOpen(now);
      setActivePayment({ bankScheme, url, paymentId });

      // Для СБП-ссылок
      if (url.includes('qr.nspk.ru')) {
        await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
          data: url,
          flags: 0x10000000
        });
        return true;
      }

      // Для прямых банковских ссылок
      const bank = Object.values(BANK_SCHEMES).find(b => b.scheme === bankScheme);
      if (!bank) {
        setCanInteract(true);
        setActivePayment(null);
        return false;
      }

      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: url,
        flags: 0x10000000,
        // @ts-ignore - игнорируем ошибку типа, так как это необходимо для работы с банковскими приложениями
        package: bank.package,
        action: bank.action
      });

      return true;
    } catch (error) {
      setCanInteract(true);
      setActivePayment(null);
      return false;
    }
  };

  /**
   * Обрабатывает изменение URL в WebView
   * 
   * @param navState - Состояние навигации
   */
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const url = navState.url;

    if (isBankAppUrl(url)) {
      handleBankAppUrl(url);
      return;
    }

    if (isSuccessUrl(url)) {
      router.replace('/(buyticket)/payment/success');
      return;
    }

    if (isFailureUrl(url)) {
      router.replace('/(buyticket)/payment/failure');
      return;
    }

    setCurrentUrl(url);
  };

  /**
   * Обрабатывает URL банковского приложения
   * 
   * @param url - URL банковского приложения
   */
  const handleBankAppUrl = async (url: string) => {
    if (!canInteract) {
      return;
    }

    try {
      setCanInteract(false);

      let bankScheme = '';
      let paymentId = '';

      if (url.includes('qr.nspk.ru')) {
        // Извлекаем банк из параметров URL
        const urlParams = new URLSearchParams(url.split('?')[1]);
        bankScheme = urlParams.get('bank') || 'bank100000000008';
        paymentId = urlParams.get('payment_id') || extractPaymentId(url);
      } else {
        const urlParts = url.split('://');
        bankScheme = urlParts[0];
        paymentId = extractPaymentId(url);
      }

      const bankName = getBankNameByScheme(bankScheme);

      const opened = await openBankAppWithIntent(url, bankScheme);
      if (opened) {
        setTimeout(() => {
          setCanInteract(true);
          setActivePayment(null);
        }, 1500);

        router.push({
          pathname: '/(buyticket)/payment/processing',
          params: { bankName, paymentId }
        });
      } else {
        setCanInteract(true);
        setActivePayment(null);
        Alert.alert(
          'Ошибка',
          'Не удалось открыть банковское приложение. Попробуйте выбрать другой способ оплаты',
          [{ 
            text: 'OK',
            onPress: () => {
              setCanInteract(true);
              setActivePayment(null);
            }
          }]
        );
      }
    } catch (error) {
      setCanInteract(true);
      setActivePayment(null);
      Alert.alert(
        'Ошибка',
        'Произошла ошибка при обработке платежа. Попробуйте еще раз',
        [{
          text: 'OK',
          onPress: () => {
            setCanInteract(true);
            setActivePayment(null);
          }
        }]
      );
    }
  };

  /**
   * JavaScript, который будет внедрен в WebView
   * Используется для перехвата банковских ссылок
   */
  const injectedJavaScript = `
    (function() {
      function handleClick(event) {
        var href = event.target.href || event.target.parentElement.href;

        if (href && (
          href.startsWith('bank') ||
          href.startsWith('sbp://') ||
          href.includes('qr.nspk.ru') ||
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

      document.addEventListener('submit', function(event) {
        var form = event.target;
        if (form && form.action) {
          if (
            form.action.startsWith('bank') ||
            form.action.startsWith('sbp://') ||
            form.action.includes('qr.nspk.ru') ||
            ${Object.values(BANK_SCHEMES)
              .map(bank => `form.action.startsWith('${bank.scheme}://')`)
              .join(' || ')}
          ) {
            event.preventDefault();
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'bank_app_url',
              url: form.action
            }));
          }
        }
      }, true);

      var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.addedNodes) {
            mutation.addedNodes.forEach(function(node) {
              if (node.nodeType === 1) {
                var links = node.getElementsByTagName('a');
                for (var i = 0; i < links.length; i++) {
                  links[i].addEventListener('click', handleClick, true);
                }
              }
            });
          }
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
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
          setCanInteract(true);
        }
      }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      scalesPageToFit={true}
      incognito={false}
      injectedJavaScript={injectedJavaScript}
    />
  );
};

// Стили компонента
const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
}); 