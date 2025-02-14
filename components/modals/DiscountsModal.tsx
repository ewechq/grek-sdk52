import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import Btn from '@/components/btns/Btn';
interface DiscountsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const DiscountsModal: React.FC<DiscountsModalProps> = ({ isVisible, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Скидки и льготы</Text>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.discountsList}>
              <Text style={styles.discountItem}>
              — 1 сопровождающий взрослый - бесплатно. Каждый последующий - 250₽
              </Text>
              <Text style={styles.discountItem}>
              — Дети до 1 года - бесплатно
              </Text>
              <Text style={styles.discountItem}>
              — С 20:00 до 21:00 в будние дни - 50%
              </Text>
              <Text style={styles.discountItem}>
              — В день рождения - 50%*
              </Text>
              <Text style={styles.discountItem}>
              — Особенные дети - 50%*
              </Text>
              <Text style={styles.discountItem}>
              — Большая семья - 30%*
              </Text>
              <Text style={styles.discountItem}>
              — 1+1 для двойняшек и тройняшек 11 числа каждого месяца.
              </Text>
            </View>

            <View style={styles.noteContainer}>
              <Text style={styles.noteText}>
                *Скидки не распространяются на ресторан и праздники в банкетных комнатах.
              </Text>
              <Text style={styles.noteText}>
                К категории «взрослые» относятся люди, достигшие 16 лет.
              </Text>
              <Text style={styles.noteText}>
                Скидки предоставляются только при предъявлении оригиналов документов, подтверждающих личность, статус или возраст ребёнка.
              </Text>
            </View>
          </ScrollView>

          <Btn title="Закрыть" bgColor={Colors.purple} textColor={Colors.white} width='full' onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  title: {
    ...TextStyles.h2,
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    marginBottom: 20,
  },
  discountsList: {
    marginBottom: 20,
  },
  discountItem: {
    ...TextStyles.text,
    marginBottom: 12,
    color: Colors.black,
  },
  noteContainer: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.grayElements,
    paddingTop: 8,
  },
  noteText: {
    ...TextStyles.textDescription,
    marginBottom: 8,
    color: Colors.grayText,
  },
  closeButton: {
    backgroundColor: Colors.purple,
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
  },
  closeButtonText: {
    ...TextStyles.text,
    color: Colors.white,
  },
});

export default DiscountsModal; 