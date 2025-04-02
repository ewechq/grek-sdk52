/**
 * Виджет для верификации SMS-кода при оплате
 * 
 * Функциональность:
 * 1. Ввод SMS-кода подтверждения
 * 2. Отправка кода на сервер
 * 3. Повторная отправка кода с таймером
 * 4. Обработка ошибок и уведомлений
 * 
 * Особенности:
 * - Валидация длины кода
 * - Таймер повторной отправки
 * - Индикация загрузки
 * - Адаптивный дизайн
 */

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import Btn from '@/components/ui/btns/Btn';
import { normalize } from '@/utils/responsive';
import { Alert } from '@/components/ui/modals/Alert';
import { SmsCodeInput } from '@/components/pages/buyticket/payment/SmsCodeInput';
import { ResendTimer } from '@/components/pages/buyticket/payment/ResendTimer';
import { useVerificationCode } from '@/hooks/buyticket/useVerificationCode';

// Константы для конфигурации
const CODE_LENGTH = 6; // Длина SMS-кода
const RESEND_TIMEOUT = 60; // Таймаут повторной отправки в секундах

/**
 * Пропсы для компонента верификации
 * 
 * @param signatureId - ID подписи для верификации
 * @param ticketData - Данные билета
 */
interface SmsVerificationWidgetProps {
  signatureId: number;
  ticketData: any;
}

export const SmsVerificationWidget: React.FC<SmsVerificationWidgetProps> = ({ 
  signatureId: initialSignatureId, 
  ticketData 
}) => {
  // Использование хука для управления состоянием верификации
  const {
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
    formatTime,
    setAlertVisible
  } = useVerificationCode({
    initialSignatureId,
    ticketData,
    codeLength: CODE_LENGTH,
    resendTimeout: RESEND_TIMEOUT
  });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Заголовок и описание */}
        <Text style={styles.title}>Введите код из SMS</Text>
        <Text style={styles.description}>
          Мы отправили код подтверждения на ваш номер телефона
        </Text>

        {/* Поле ввода SMS-кода */}
        <SmsCodeInput
          codeLength={CODE_LENGTH}
          code={code}
          onChange={handleCodeChange}
        />

        {/* Кнопка отправки */}
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

        {/* Таймер повторной отправки */}
        <ResendTimer
          timer={timer}
          canResend={canResend}
          onResend={handleResendCode}
          formatTime={formatTime}
        />
      </View>

      {/* Модальное окно с уведомлениями */}
      <Alert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

// Стили компонента
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 0,
    alignItems: 'center',
    justifyContent: 'center'
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
}); 