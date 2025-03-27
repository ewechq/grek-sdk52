import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import Btn from '@/components/ui/btns/Btn';
import { normalize } from '@/utils/responsive';
import { Alert } from '@/components/ui/modals/Alert';
import { SmsCodeInput } from '@/components/pages/buyticket/payment/SmsCodeInput';
import { ResendTimer } from '@/components/pages/buyticket/payment/ResendTimer';
import { useVerificationCode } from '@/hooks/buyticket/useVerificationCode';

const CODE_LENGTH = 6;
const RESEND_TIMEOUT = 60;

interface SmsVerificationWidgetProps {
  signatureId: number;
  ticketData: any;
}

export const SmsVerificationWidget: React.FC<SmsVerificationWidgetProps> = ({ 
  signatureId: initialSignatureId, 
  ticketData 
}) => {
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
        <Text style={styles.title}>Введите код из SMS</Text>
        <Text style={styles.description}>
          Мы отправили код подтверждения на ваш номер телефона
        </Text>

        <SmsCodeInput
          codeLength={CODE_LENGTH}
          code={code}
          onChange={handleCodeChange}
        />

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

        <ResendTimer
          timer={timer}
          canResend={canResend}
          onResend={handleResendCode}
          formatTime={formatTime}
        />
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