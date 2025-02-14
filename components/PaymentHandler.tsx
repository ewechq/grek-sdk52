import { useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';

interface PreOrderData {
  name: string;
  phone: string;
  email: string;
  childAge: {
    "1-4": number;
    "5-16": number;
  };
}

interface PreOrderResponse {
  message: string;
  link: string;
}

export default function PaymentHandler() {
  const [loading, setLoading] = useState(false);

  const handlePreOrder = async (data: PreOrderData) => {
    setLoading(true);
    
    // Логируем данные запроса
    console.log('Отправляем данные на API:', {
      url: 'https://api.grekland.ru/api/ticket/preorder',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data
    });

    try {
      const response = await fetch('https://api.grekland.ru/api/ticket/preorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: PreOrderResponse = await response.json();
      
      // Логируем ответ
      console.log('Получен ответ от API:', result);

      if (response.ok && result.link) {
        // Переходим на страницу с WebView и передаем URL для оплаты
        router.push({
          pathname: '/(buyticket)/payment',
          params: { url: result.link }
        });
      } else {
        Alert.alert('Ошибка', result.message || 'Произошла ошибка при создании заказа');
      }
    } catch (error) {
      // Логируем ошибку
      console.error('Ошибка при отправке запроса:', error);
      Alert.alert('Ошибка', 'Произошла ошибка при отправке данных');
    } finally {
      setLoading(false);
    }
  };

  return {
    handlePreOrder,
    loading,
  };
}
