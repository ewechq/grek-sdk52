import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Colors, Typography } from '@/theme';
import Btn from '@/components/ui/btns/Btn';

interface UpdateModalProps {
  visible: boolean;
  onUpdate: () => void;
  serverVersion?: string;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  visible,
  onUpdate,
  serverVersion
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      // Запрещаем закрытие нажатием за пределами модального окна
      onRequestClose={() => {}}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>
            Требуется обновление!
          </Text>

          {serverVersion && (
            <Text style={styles.versionText}>
              Версия {serverVersion}
            </Text>
          )}
          
          <Text style={styles.modalText}>
            Для корректной работы приложения необходимо выполнить обновление до актуальной версии. 
            Вы не сможете использовать приложение без обновления.
          </Text>
          
          <View style={styles.buttonsContainer}>
            <Btn
              title="Обновить"
              onPress={onUpdate}
              bgColor={Colors.green}
              textColor={Colors.black}
              width="full"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 25,
    padding: 24,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    ...Typography.h2(),
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  versionText: {
    ...Typography.small(),
    color: Colors.black,
    marginBottom: 8,
    fontWeight: '600',
  },
  modalText: {
    ...Typography.caption(),
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonsContainer: {
    width: '100%',
  },

}); 