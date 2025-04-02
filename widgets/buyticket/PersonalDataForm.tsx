/**
 * Виджет формы персональных данных для покупки билетов
 * 
 * Функциональность:
 * 1. Сбор персональных данных покупателя (ФИО, телефон, email)
 * 2. Валидация введенных данных
 * 3. Выбор количества билетов по возрастным категориям
 * 
 * Особенности:
 * - Валидация ФИО (минимум 2 символа)
 * - Маскированный ввод телефона
 * - Валидация email
 * - Счетчики для разных возрастных категорий
 * - Ограничение на минимальное количество билетов
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import { normalize } from '@/utils/responsive';
import PhoneInput from '@/components/ui/inputs/InputPhone';
import EmailInput from '@/components/ui/inputs/InputEmail';
import Counter from '@/components/ui/btns/CounterComponent';

/*Компонент ввода ФИО*/
interface NameInputProps {
  value: string;
  onChange: (text: string) => void;
  onValidityChange?: (isValid: boolean) => void;
}

const NameInput: React.FC<NameInputProps> = ({
  value,
  onChange,
  onValidityChange
}) => {
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // Обработчик изменения текста с валидацией
  const handleChange = (text: string) => {
    if (text.length <= 255) {
      onChange(text);
      const valid = text.trim().length >= 2;
      setIsValid(valid);
      onValidityChange?.(valid);
    }
  };

  // Обработчик потери фокуса
  const handleBlur = () => {
    setIsTouched(true);
    const valid = value.trim().length >= 2;
    setIsValid(valid);
    onValidityChange?.(valid);
  };

  return (
    <View>
      <TextInput
        style={[
          styles.input,
          {
            borderBottomColor: !isValid && isTouched ? Colors.red : Colors.grayElements,
            marginBottom: !isValid && isTouched ? 24 : 12
          }
        ]}
        placeholder="Ваше ФИО"
        placeholderTextColor={Colors.grayText}
        value={value}
        onChangeText={handleChange}
        onBlur={handleBlur}
        maxLength={255}
      />
      {!isValid && isTouched && (
        <Text style={styles.errorText}>
          Введите корректное ФИО (минимум 2 символа)
        </Text>
      )}
    </View>
  );
};

/**
 * Пропсы для формы персональных данных
 */
interface PersonalDataFormProps {
  formData: {
    name: string;
    phone: string;
    email: string;
  };
  setFormData: (data: any) => void;
  guestCounts: {
    onetofour: number;    // Дети от 1 до 4 лет
    fivetosixteen: number; // Дети от 5 до 16 лет
    attendant: number;    // Взрослые
  };
  setGuestCounts: (counts: any) => void;
  onNameValidityChange?: (isValid: boolean) => void;
  onPhoneValidityChange?: (isValid: boolean) => void;
  onEmailValidityChange?: (isValid: boolean) => void;
}

/**
 * Основной компонент формы персональных данных
 */
export const PersonalDataForm = ({
  formData,
  setFormData,
  guestCounts,
  setGuestCounts,
  onNameValidityChange,
  onPhoneValidityChange,
  onEmailValidityChange
}: PersonalDataFormProps) => {
  return (
    <View style={styles.container}>
      {/* Секция персональных данных */}
      <Text style={[styles.sectionTitle, {marginBottom: normalize(8)}]}>
        Ваши данные:
      </Text>
      
      {/* Поле ввода ФИО */}
      <NameInput
        value={formData.name}
        onChange={(text) => setFormData({...formData, name: text})}
        onValidityChange={onNameValidityChange}
      />
      
      {/* Поле ввода телефона */}
      <PhoneInput
        initialValue={formData.phone}
        onPhoneChange={(text) => setFormData({...formData, phone: text})}
        onValidityChange={onPhoneValidityChange}
      />
      
      {/* Поле ввода email */}
      <EmailInput
        value={formData.email}
        onChange={(text) => setFormData({...formData, email: text})}
        onValidityChange={onEmailValidityChange}
      />

      {/* Секция выбора количества билетов */}
      <Text style={[styles.sectionTitle, {marginTop: normalize(40),}]}>
        Количество билетов:
      </Text>           
      <View style={styles.countersContainer}>
        {/* Информация о бесплатном сопровождающем */}
        <Text style={styles.attendantText}>
          Один сопровождающий взрослый - бесплатно. Билеты на последующих можете приобрести ниже.
        </Text>
        
        {/* Счетчик для детей от 1 до 4 лет */}
        <View style={styles.counterRow}>
          <Counter
            label="От 1 до 4 лет:"
            value={guestCounts.onetofour}
            onIncrease={() => setGuestCounts({...guestCounts, onetofour: guestCounts.onetofour + 1})}
            onDecrease={() => setGuestCounts({...guestCounts, onetofour: Math.max(0, guestCounts.onetofour - 1)})}
          />
        </View>
        
        {/* Счетчик для детей от 5 до 16 лет */}
        <View style={styles.counterRow}>
          <Counter
            label="От 5 до 16 лет:"
            value={guestCounts.fivetosixteen}
            onIncrease={() => setGuestCounts({...guestCounts, fivetosixteen: guestCounts.fivetosixteen + 1})}
            onDecrease={() => setGuestCounts({...guestCounts, fivetosixteen: Math.max(0, guestCounts.fivetosixteen - 1)})}
          />
        </View>
        
        {/* Счетчик для взрослых */}
        <View style={styles.counterRow}>
          <Counter
            label="Взрослые:"
            value={guestCounts.attendant}
            onIncrease={() => setGuestCounts({...guestCounts, attendant: guestCounts.attendant + 1})}
            onDecrease={() => setGuestCounts({...guestCounts, attendant: Math.max(0, guestCounts.attendant - 1)})}
          />
        </View>
      </View>
    </View>
  );
};

// Стили компонента
const styles = StyleSheet.create({
  container: {
    marginBottom: normalize(40),
    marginHorizontal: normalize(16)
  },
  sectionTitle: {
    ...TextStyles.h2,
    color: Colors.black,
    marginBottom: normalize(8),
  },
  input: {
    height: 50,
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(16),
    color: Colors.black,
    ...TextStyles.text,
  },
  errorText: {
    position: 'absolute',
    bottom: 4,
    left: normalize(16),
    right: normalize(16),
    ...TextStyles.textDescription,
    color: Colors.red,
  },
  counterSection: {
    marginTop: normalize(40),
  },
  countersContainer: {
    gap: normalize(4),
  },
  counterRow: {
    width: '100%',
    paddingHorizontal: normalize(16)
  },
  attendantText: {
    ...TextStyles.textDescription,
    color: Colors.grayText,
    marginBottom: normalize(16),
  }
}); 