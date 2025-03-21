import React, { useRef, useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Keyboard } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import Header from '@/components/ui/layout/Header';
import Btn from '@/components/ui/btns/Btn';
import { router, useLocalSearchParams } from 'expo-router';
import { normalize } from '@/utils/responsive';
import { Alert } from '@/components/ui/modals/Alert';

const CODE_LENGTH = 6;
const RESEND_TIMEOUT = 60; // 60 секунд для повторной отправки

const ConfirmNumberPage = () => {
  const params = useLocalSearchParams();
  const [code, setCode] = useState<string[]>(new Array(CODE_LENGTH).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('Ошибка!');
  const [timer, setTimer] = useState(RESEND_TIMEOUT);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  // Получаем параметры с дополнительными проверками
  const [signatureId, setSignatureId] = useState(Number(params.signatureId));
  let ticketData = null;
  
  try {
    if (params.ticketData) {
      ticketData = JSON.parse(params.ticketData as string);
    }
  } catch (error) {
    console.error('Ошибка при парсинге ticketData:', error);
  }

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
  }, []);

  // Эффект для обновления URL при изменении signatureId
  useEffect(() => {
    if (signatureId !== Number(params.signatureId)) {
      router.setParams({ signatureId: String(signatureId) });
    }
  }, [signatureId]);

  const handleCodeChange = (text: string, index: number) => {
    // Убеждаемся, что вводятся только цифры
    if (!/^\d*$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    // Если введена цифра, переходим к следующему полю
    if (text.length === 1 && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    // При нажатии backspace с пустым полем переходим к предыдущему полю
    if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
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
    if (smsCode.length !== CODE_LENGTH) {
      showAlert('Ошибка!', 'Пожалуйста, введите полный код подтверждения');
      return;
    }

    setIsLoading(true);

    try {
      const checkData = {
        id: signatureId,
        code: Number(smsCode)
      };
      console.log('Отправляем данные для проверки:', checkData);

      // Проверяем код подтверждения
      const signatureCheckResponse = await fetch('https://dev.api.grekland.ru/api/ticket/signatureCheck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(checkData)
      });

      const signatureCheckResult = await signatureCheckResponse.json();
      console.log('Ответ проверки кода:', signatureCheckResult);

      if (signatureCheckResponse.ok && signatureCheckResult.signature === true) {
        // Если код подтвержден, создаем заказ
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
          // Переходим на страницу оплаты
          router.push({
            pathname: '/(buyticket)/payment',
            params: { url: orderResult.link }
          });
        } else {
          throw new Error(orderResult.message || 'Ошибка при создании заказа');
        }
      } else {
        throw new Error(signatureCheckResult.message || 'Неверный код подтверждения');
      }
    } catch (error) {
      console.error('Ошибка:', error);
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

      if (response.ok && result.id) {
        // Обновляем ID подписи и очищаем код
        setSignatureId(result.id);
        setCode(new Array(CODE_LENGTH).fill(''));
        showAlert('Успешно!', 'Мы отправили новый код подтверждения на ваш номер телефона', false);
        setTimer(RESEND_TIMEOUT);
        setCanResend(false);
      } else {
        throw new Error(result.message || 'Ошибка при отправке кода');
      }
    } catch (error) {
      console.error('Ошибка при повторной отправке кода:', error);
      if (error instanceof Error && error.message === 'Сообщение с кодом отправлено.') {
        showAlert('Успешно!', 'Мы отправили новый код подтверждения на ваш номер телефона', false);
        setTimer(RESEND_TIMEOUT);
        setCanResend(false);
      } else {
        showAlert('Ошибка!', error instanceof Error ? error.message : 'Не удалось отправить код повторно');
      }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Введите код из SMS</Text>
        <Text style={styles.description}>
          Мы отправили код подтверждения на ваш номер телефона
        </Text>

        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={ref => {
                if (ref) inputRefs.current[index] = ref;
              }}
              style={[
                styles.codeInput,
                digit && styles.codeInputFilled
              ]}
              value={digit}
              onChangeText={text => handleCodeChange(text, index)}
              onKeyPress={e => handleKeyPress(e, index)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
              onFocus={() => {
                inputRefs.current[index]?.setNativeProps({
                  selection: { start: 0, end: 1 }
                });
              }}
            />
          ))}
        </View>
        <View style={{marginBottom: normalize(16)}}>
          <Btn
            title={isLoading ? "Подождите..." : "Отправить"}
            onPress={handleSubmit}
            width="full"
            bgColor={Colors.purple}
            textColor={Colors.white}
            disabled={isLoading}
          />
        </View>

        <Text style={styles.resendCode}>
          Не получили код?{' '}
          {timer > 0 ? (
            <Text style={styles.timerText}>
              Повторная отправка через {formatTime(timer)}
            </Text>
          ) : (
            <Text style={styles.resendButton} onPress={handleResendCode}>
              Отправить снова
            </Text>
          )}
        </Text>
      </View>

      <Alert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    alignItems: 'center',
    justifyContent:'center'
  },
  title: {
    ...TextStyles.h2,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    ...TextStyles.text,
    color: Colors.grayText,
    textAlign: 'center',
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom:24,
  },
  codeInput: {
    width: 45,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.grayElements,
    backgroundColor: Colors.white,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  codeInputFilled: {
    borderColor: Colors.purple,
    backgroundColor: Colors.purpleLight,
  },
  resendCode: {
    ...TextStyles.text,
    color: Colors.grayText,
  },
  resendButton: {
    color: Colors.purple,
    textDecorationLine: 'underline',
  },
  timerText: {
    color: Colors.grayText,
  },
});

export default ConfirmNumberPage;