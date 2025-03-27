import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export const usePaymentProcessing = (paymentId: string | undefined) => {
  const router = useRouter();

  useEffect(() => {
    if (!paymentId) return;

    // Логика проверки статуса платежа
    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`https://dev.api.grekland.ru/api/ticket/payment/status/${paymentId}`);
        const result = await response.json();

        if (result.status === 'success') {
          router.replace('/(buyticket)/payment/success');
        } else if (result.status === 'failed') {
          router.replace('/(buyticket)/payment/failure');
        }
        // Если статус pending, продолжаем ожидание
      } catch (error) {
        console.error('Ошибка при проверке статуса платежа:', error);
      }
    };

    // Запускаем проверку каждые 5 секунд
    const interval = setInterval(checkPaymentStatus, 5000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(interval);
  }, [paymentId, router]);

  const handleCancel = () => {
    router.replace('/(buyticket)');
  };

  return {
    handleCancel
  };
}; 