import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import { BaseModal } from './BaseModal';

interface DiscountsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export const DiscountsModal: React.FC<DiscountsModalProps> = ({
  isVisible,
  onClose
}) => (
  <BaseModal
    isVisible={isVisible}
    onClose={onClose}
    title="Скидки и льготы"
    scrollable
  >
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
  </BaseModal>
);

const styles = StyleSheet.create({
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
}); 