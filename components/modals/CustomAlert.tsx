import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import Btn from '@/components/btns/Btn';
interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, title, message, onClose }) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <Btn onPress={onClose} title="Oк" width="full" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  alertContainer: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    ...TextStyles.h2,
    color: Colors.black,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    ...TextStyles.text,
    color: Colors.black,
    marginBottom: 24,
    textAlign: 'left',
  },
  button: {
    backgroundColor: Colors.purple,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    ...TextStyles.h2,
    color: Colors.white,
  },
});

export default CustomAlert; 