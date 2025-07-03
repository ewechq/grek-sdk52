import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Typography } from '@/theme';

interface ResendTimerProps {
  timer: number;
  canResend: boolean;
  onResend: () => void;
  formatTime: (seconds: number) => string;
}

export const ResendTimer: React.FC<ResendTimerProps> = ({ 
  timer, 
  canResend, 
  onResend, 
  formatTime 
}) => {
  return (
    <Text style={styles.resendCode}>
      Не получили код?{' '}
      {timer > 0 ? (
        <Text style={styles.timerText}>
          Повторная отправка через {formatTime(timer)}
        </Text>
      ) : (
        <Text style={styles.resendButton} onPress={onResend}>
          Отправить снова
        </Text>
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  resendCode: {
    ...Typography.small(),
    color: Colors.grayText,
    textAlign: 'center'
  },
  resendButton: {
    color: Colors.purple,
    textDecorationLine: 'underline',
  },
  timerText: {
    color: Colors.grayText,
  },
});
