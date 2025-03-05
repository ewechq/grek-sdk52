import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';
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
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.alertContainer} 
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <TouchableOpacity style={{position:'absolute', top:4, right:0, padding:16}} onPress={onClose}>
            <Ionicons name="add-outline" size={24} style={{transform:[{rotate:'45deg'}]}} color={Colors.black} />
          </TouchableOpacity>
        
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
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
    paddingHorizontal: 16, 
    paddingVertical: 24,
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

    textAlign: 'left',
    lineHeight: 13,
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