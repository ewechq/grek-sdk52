import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Platform, Alert, Linking } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as IntentLauncher from 'expo-intent-launcher';

// Определяем известные схемы банковских приложений
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

const PaymentScreen = () => {
  const router = useRouter();
  const { url } = useLocalSearchParams<{ url: string }>();
  const webViewRef = useRef<WebView>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (url) {
      const decodedUrl = decodeURIComponent(url).replace(/\\/g, '');
      console.log('Initial Payment URL:', decodedUrl);
      setCurrentUrl(decodedUrl);
    }
  }, [url]);

  if (!url) {
    router.back();
    return null;
  }

  // Функция для открытия банковского приложения через Intent на Android
  const openBankAppWithIntent = async (url: string, bankScheme: string) => {
    try {
      const bank = Object.values(BANK_SCHEMES).find(b => b.scheme === bankScheme);
      if (!bank) return false;

      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: url,
        flags: 0x10000000, // FLAG_ACTIVITY_NEW_TASK
        // @ts-ignore - игнорируем ошибку типов, так как эти параметры необходимы для работы с банковскими приложениями
        package: bank.package,
        action: bank.action
      });
      return true;
    } catch (error) {
      console.error('Ошибка при открытии через Intent:', error);
      return false;
    }
  };

  // Функция для получения имени банка по схеме
  const getBankNameByScheme = (scheme: string): string => {
    const bank = Object.entries(BANK_SCHEMES).find(([_, value]) => value.scheme === scheme);
    if (bank) {
      return bank[0].charAt(0).toUpperCase() + bank[0].slice(1);
    }
    return 'банка';
  };

  // Функция для извлечения paymentId из URL
  const extractPaymentId = (url: string): string => {
    const match = url.match(/transaction_id[=\/](\d+)/);
    return match ? match[1] : '';
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const url = navState.url;

    // Проверяем URL на специальные схемы банковских приложений
    if (
      url.startsWith('bank') || 
      url.startsWith('sbp://') ||
      Object.values(BANK_SCHEMES).some(bank => url.startsWith(`${bank.scheme}://`))
    ) {
      handleBankAppUrl(url);
      return;
    }

    // Проверяем успешную оплату
    if (url.includes('success') || url.includes('payment_success')) {
      router.replace('/success');
      return;
    }

    // Проверяем ошибку оплаты
    if (url.includes('fail') || url.includes('payment_fail')) {
      router.replace('/failure');
      return;
    }
  };

  const handleBankAppUrl = async (url: string) => {
    try {
      // Если это URL банковского приложения
      if (url.startsWith('bank') || url.startsWith('sbp://') || 
          Object.values(BANK_SCHEMES).some(bank => url.startsWith(`${bank.scheme}://`))) {
        
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
              pathname: '/(buyticket)/payment-processing',
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
              pathname: '/(buyticket)/payment-processing',
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
                      pathname: '/(buyticket)/payment-processing',
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

  // Инжектируем JavaScript для перехвата всех кликов по ссылкам
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
      
      // Добавляем обработчик для всех форм
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

      // Добавляем обработчик для всех ссылок с target="_blank"
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
          console.error('Ошибка при обработке сообщения от WebView:', error);
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

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});

export default PaymentScreen;