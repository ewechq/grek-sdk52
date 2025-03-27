import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { getInjectedJavaScript } from '@/components/pages/buyticket/payment/injectedJavaScript';
import { usePayment } from '@/hooks/buyticket/usePayment';
import { useRouter } from 'expo-router';
import { Colors, TextStyles } from '@/theme';

interface PaymentWebViewProps {
  initialUrl: string;
}

const ErrorView = ({ onRetry }: { onRetry: () => void }) => {
  const router = useRouter();
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Ошибка загрузки</Text>
      <Text style={styles.errorMessage}>
        Произошла ошибка при загрузке страницы оплаты. Пожалуйста, попробуйте снова.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Повторить</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={() => router.replace('/(buyticket)/payment/failure')}
      >
        <Text style={styles.cancelButtonText}>Отменить платеж</Text>
      </TouchableOpacity>
    </View>
  );
};

export const PaymentWebView: React.FC<PaymentWebViewProps> = ({ initialUrl }) => {
  const router = useRouter();
  const {
    webViewRef,
    currentUrl,
    setCurrentUrl,
    handleNavigationStateChange,
    handleBankAppUrl
  } = usePayment();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  React.useEffect(() => {
    if (initialUrl) {
      try {
        // Декодируем URL и удаляем экранирование обратных слешей
        const decodedUrl = decodeURIComponent(initialUrl).replace(/\\/g, '');
        // Проверка и исправление URL если он содержит некорректное экранирование
        const cleanUrl = decodedUrl.startsWith('"') && decodedUrl.endsWith('"') 
          ? decodedUrl.substring(1, decodedUrl.length - 1) 
          : decodedUrl;
        
        console.log('Initial Payment URL:', cleanUrl);
        setCurrentUrl(cleanUrl);
        setError(null);
      } catch (error) {
        console.error('Ошибка при обработке исходного URL:', error);
        setError(error instanceof Error ? error : new Error('Неизвестная ошибка'));
        setCurrentUrl(initialUrl); // Используем оригинальный URL в случае ошибки
      }
    }
  }, [initialUrl, setCurrentUrl]);

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      switch (data.type) {
        case 'bank_app_url':
          handleBankAppUrl(data.url);
          break;
        
        case 'qr_detected':
          console.log('Обнаружен QR-код:', data.url);
          // Здесь можно добавить обработку QR-кода, если нужно
          break;
          
        case 'payment_error':
          console.error('Ошибка платежа:', data.message);
          router.replace('/(buyticket)/payment/failure');
          break;
          
        case 'page_error':
          console.error('Ошибка на странице:', data.message);
          if (data.message.includes('платеж') || data.message.includes('payment')) {
            router.replace('/(buyticket)/payment/failure');
          }
          break;
          
        default:
          console.log('Неизвестный тип сообщения:', data.type);
      }
    } catch (error) {
      console.error('Ошибка при обработке сообщения от WebView:', error);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  if (!currentUrl) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.purple} />
        <Text style={styles.loadingText}>Подготовка платежа...</Text>
      </View>
    );
  }

  if (error) {
    return <ErrorView onRetry={handleRetry} />;
  }

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.purple} />
          <Text style={styles.loadingText}>Загрузка платежной страницы...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        source={{ uri: currentUrl }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        incognito={false}
        injectedJavaScript={getInjectedJavaScript()}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          // Игнорируем ошибку ERR_UNKNOWN_URL_SCHEME
          if (nativeEvent.description?.includes('ERR_UNKNOWN_URL_SCHEME')) {
            return;
          }
          console.warn('Ошибка WebView:', nativeEvent);
          setError(new Error(nativeEvent.description || 'Ошибка загрузки страницы'));
        }}
        onHttpError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('HTTP ошибка WebView:', nativeEvent);
          if (nativeEvent.statusCode >= 400) {
            setError(new Error(`Ошибка ${nativeEvent.statusCode}: ${nativeEvent.description || 'Ошибка загрузки страницы'}`));
            // Если ошибка серьезная (5xx), перенаправляем на страницу ошибки
            if (nativeEvent.statusCode >= 500) {
              router.replace('/(buyticket)/payment/failure');
            }
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  loadingText: {
    ...TextStyles.text,
    marginTop: 12,
    color: Colors.black,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
  },
  errorTitle: {
    ...TextStyles.h2,
    color: Colors.red,
    marginBottom: 12,
  },
  errorMessage: {
    ...TextStyles.text,
    textAlign: 'center',
    marginBottom: 24,
    color: Colors.grayText,
  },
  retryButton: {
    backgroundColor: Colors.purple,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
  },
  retryButtonText: {
    ...TextStyles.text,
    color: Colors.white,
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    ...TextStyles.text,
    color: Colors.grayText,
    textDecorationLine: 'underline',
  },
}); 