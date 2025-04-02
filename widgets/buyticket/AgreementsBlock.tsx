/**
 * Виджет блока соглашений при покупке билетов
 * 
 * Функциональность:
 * 1. Отображение чекбоксов с соглашениями
 * 2. Управление состоянием соглашений
 * 3. Предоставление ссылок на документы
 * 
 * Особенности:
 * - Интерактивные чекбоксы с ссылками
 * - Отдельные соглашения для разных документов
 * - Адаптивные отступы
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { normalize } from '@/utils/responsive';
import { CheckboxWithLink } from '@/components/ui/btns/CheckboxWithLink';

/* Пропсы для компонента соглашений */
interface AgreementsBlockProps {
  agreements: {
    privacy: boolean;  // Согласие с политикой конфиденциальности
    rules: boolean;    // Согласие с правилами парка
    offer: boolean;    // Согласие с публичной офертой
    price: boolean;    // Согласие с прайс-листом
  };
  setAgreements: (agreements: any) => void;
}

export const AgreementsBlock = ({
  agreements,
  setAgreements
}: AgreementsBlockProps) => {
  return (
    <View style={styles.container}>
      {/* Чекбокс согласия с политикой конфиденциальности */}
      <CheckboxWithLink
        checked={agreements.privacy}
        onCheck={() => setAgreements({...agreements, privacy: !agreements.privacy})}
        label="Политикой в отношении обработки персональных данных"
        url="https://grekland.ru/privacy.html"
      />
      
      {/* Чекбокс согласия с правилами парка */}
      <CheckboxWithLink
        checked={agreements.rules}
        onCheck={() => setAgreements({...agreements, rules: !agreements.rules})}
        label="Правилами парка"
        url="https://grekland.ru/regulations.html"
      />
      
      {/* Чекбокс согласия с прайс-листом */}
      <CheckboxWithLink
        checked={agreements.price}
        onCheck={() => setAgreements({...agreements, price: !agreements.price})}
        label="Прайс листом"
        url="https://grekland.ru/ticket.html"
      />
      
      {/* Чекбокс согласия с публичной офертой */}
      <CheckboxWithLink
        checked={agreements.offer}
        onCheck={() => setAgreements({...agreements, offer: !agreements.offer})}
        label="Публичной офертой"
        url="https://grekland.ru/public-offer.html"
      />
    </View>
  );
};

// Стили компонента
const styles = StyleSheet.create({
  container: {
    marginBottom: normalize(40),
    marginHorizontal: normalize(16)
  }
}); 