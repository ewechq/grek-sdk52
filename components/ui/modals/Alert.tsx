import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import { BaseModal } from './BaseModal';

interface AlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

export const Alert: React.FC<AlertProps> = ({
  visible,
  title,
  message,
  onClose
}) => (
  <BaseModal
    isVisible={visible}
    onClose={onClose}
    title={title}
    type="alert"
  >
    <View style={styles.messageContainer}>
      <Text style={styles.message}>{message}</Text>
    </View>
  </BaseModal>
);

const styles = StyleSheet.create({
  messageContainer: {
    paddingHorizontal: 8,
  },
  message: {
    ...TextStyles.text,
    color: Colors.black,
    lineHeight: 24,
  },
}); 