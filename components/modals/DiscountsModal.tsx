import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import Btn from '@/components/btns/Btn';
import Svg, { Path } from 'react-native-svg';

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
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
            <View style={styles.modalContent}>
              <TouchableOpacity 
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              >
                <Svg width="20" height="20" viewBox="0 0 20 20">
                  <Path
                    d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                    fill={Colors.grayText}
                  />
                </Svg>
              </TouchableOpacity>

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

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    position: 'relative',
  },
  title: {
    ...TextStyles.h2,
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
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
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    ...TextStyles.text,
    color: Colors.white,
  },
});

export default DiscountsModal; 