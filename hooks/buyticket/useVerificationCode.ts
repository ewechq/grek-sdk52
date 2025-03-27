import { useState, useEffect } from 'react';
import { router } from 'expo-router';

interface UseVerificationCodeProps {
  initialSignatureId: number;
  ticketData: any;
  codeLength: number;
  resendTimeout: number;
}

export const useVerificationCode = ({
  initialSignatureId,
  ticketData,
  codeLength,
  resendTimeout
}: UseVerificationCodeProps) => {
  const [code, setCode] = useState<string[]>(new Array(codeLength).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('Ошибка!');
  const [timer, setTimer] = useState(resendTimeout);
  const [canResend, setCanResend] = useState(false);
  const [signatureId, setSignatureId] = useState(initialSignatureId);

  // Эффект для управления таймером
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 0) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [signatureId]);

  const handleCodeChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
  };

  const showAlert = (title: string, message: string, isError: boolean = true) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSubmit = async () => {
    if (!signatureId || isNaN(signatureId)) {
      showAlert('Ошибка!', 'Некорректный ID подписи');
      return;
    }

    if (!ticketData) {
      showAlert('Ошибка!', 'Отсутствуют данные заказа');
      return;
    }

    const smsCode = code.join('');
    if (smsCode.length !== codeLength) {
      showAlert('Ошибка!', 'Пожалуйста, введите полный код подтверждения');
      return;
    }

    setIsLoading(true);

    try {
      const checkData = {
        id: signatureId,
        code: Number(smsCode)
      };

      const signatureCheckResponse = await fetch('https://dev.api.grekland.ru/api/ticket/signatureCheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(checkData)
      });

      const signatureCheckResult = await signatureCheckResponse.json();

      if (signatureCheckResponse.ok && signatureCheckResult.signature === true) {
        const orderResponse = await fetch('https://dev.api.grekland.ru/api/ticket/preorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(ticketData)
        });

        const orderResult = await orderResponse.json();

        if (orderResponse.ok && orderResult.link) {
          router.push({
            pathname: '/(buyticket)/payment',
            params: { url: orderResult.link }
          });
        } else {
          throw new Error(orderResult.message || 'Ошибка при создания заказа');
        }
      } else {
        throw new Error(signatureCheckResult.message || 'Неверный код подтверждения');
      }
    } catch (error) {
      console.error('Ошибка при обработке запроса:', error);
      showAlert('Ошибка!', error instanceof Error ? error.message : 'Произошла ошибка при обработке запроса');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;
    
    if (!ticketData?.phone) {
      showAlert('Ошибка!', 'Отсутствует номер телефона');
      return;
    }

    try {
      const response = await fetch('https://dev.api.grekland.ru/api/ticket/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          phone: ticketData.phone
        })
      });

      const result = await response.json();

      if (response.ok && result.signature?.id) {
        setSignatureId(result.signature.id);
        setCode(new Array(codeLength).fill(''));
        showAlert('Успешно!', 'Мы отправили новый код подтверждения', false);
        setCanResend(false);
        setTimer(resendTimeout);
      } else {
        throw new Error(result.message || 'Ошибка при отправке кода');
      }
    } catch (error) {
      console.error('Ошибка при повторной отправке кода:', error);
      showAlert('Ошибка!', error instanceof Error ? error.message : 'Не удалось отправить код повторно');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return {
    code,
    isLoading,
    alertVisible,
    alertMessage,
    alertTitle,
    timer,
    canResend,
    handleCodeChange,
    handleSubmit,
    handleResendCode,
    showAlert,
    formatTime,
    setAlertVisible
  };
}; 