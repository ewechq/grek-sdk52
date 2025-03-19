import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import { AntDesign } from '@expo/vector-icons';

interface BaseModalProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  scrollable?: boolean;
  type?: 'alert' | 'content';
}

export const BaseModal: React.FC<BaseModalProps> = ({
  isVisible,
  onClose,
  title,
  children,
  scrollable = false,
  type = 'content'
}) => {
  const Content = scrollable ? ScrollView : View;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          style={[
            styles.container,
            type === 'alert' && styles.alertContainer
          ]} 
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          <TouchableOpacity 
            style={styles.closeButton} 
            onPress={onClose}
          >
            <AntDesign 
              name="close" 
              size={16} 
              color={Colors.black} 
            />
          </TouchableOpacity>

          {title && (
            <Text style={styles.title}>{title}</Text>
          )}

          <Content style={scrollable && styles.scrollContent}>
            {children}
          </Content>
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
  container: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  alertContainer: {
    maxHeight: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 4,
    right: 0,
    padding: 16,
    zIndex: 1,
  },
  title: {
    ...TextStyles.h2,
    textAlign: 'center',
    marginBottom: 16,
  },
  scrollContent: {
    //maxHeight: '100%',
  },
}); 