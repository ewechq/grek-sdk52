import React, { useState, useEffect } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { Typography, Colors } from '@/theme';

interface PhoneInputProps {
  initialValue: string;
  onPhoneChange: (text: string) => void;
  onValidityChange?: (isValid: boolean) => void;
  backgroundColor?: string;
  borderColor?: string;
  placeholderColor?: string;
  textColor?: string;
  errorColor?: string;
}

const isValidPhone = (phone: string) => {
  // Удаляем все нецифровые символы
  const digits = phone.replace(/\D/g, '');
  // Проверяем длину (должно быть 11 цифр для российского номера)
  return digits.length === 11;
};

const PhoneInput: React.FC<PhoneInputProps> = ({
  initialValue,
  onPhoneChange,
  onValidityChange,
  backgroundColor = Colors.white,
  borderColor = Colors.grayBg,
  placeholderColor = Colors.grayText,
  textColor = Colors.black,
  errorColor = Colors.red
}) => {
  const [value, setValue] = useState(initialValue);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    const isValid = value === "" || isValidPhone(value);
    onValidityChange?.(isValid);
  }, [value, onValidityChange]);

  const formatPhoneNumber = (text: string) => {
    // Удаляем все нецифровые символы
    const cleaned = text.replace(/\D/g, '');
    
    // Форматируем номер
    let formatted = '';
    if (cleaned.length > 0) {
      formatted = '+' + cleaned;
      if (cleaned.length > 1) {
        formatted = formatted.slice(0, 2) + ' (' + formatted.slice(2);
      }
      if (cleaned.length > 4) {
        formatted = formatted.slice(0, 7) + ') ' + formatted.slice(7);
      }
      if (cleaned.length > 7) {
        formatted = formatted.slice(0, 12) + '-' + formatted.slice(12);
      }
      if (cleaned.length > 9) {
        formatted = formatted.slice(0, 15) + '-' + formatted.slice(15);
      }
    }
    
    return formatted;
  };

  const handleChangeText = (text: string) => {
    const formatted = formatPhoneNumber(text);
    setValue(formatted);
    onPhoneChange(formatted);
    
    if (isTouched) {
      const isValid = text === "" || isValidPhone(text);
      setIsPhoneValid(isValid);
      onValidityChange?.(isValid);
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
    const isValid = value === "" || isValidPhone(value);
    setIsPhoneValid(isValid);
    onValidityChange?.(isValid);
  };

  return (
    <View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor,
            color: textColor,
            borderColor: !isPhoneValid && isTouched ? errorColor : borderColor,
            marginBottom: !isPhoneValid && isTouched ? 24 : 12
          }
        ]}
        placeholder="+7 (___) ___-__-__"
        placeholderTextColor={placeholderColor}
        keyboardType="phone-pad"
        value={value}
        onChangeText={handleChangeText}
        onBlur={handleBlur}
        maxLength={18}
      />
      {!isPhoneValid && isTouched && (
        <Text style={[styles.errorText, { color: errorColor }]}>
          Введите корректный номер телефона
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 0,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    color: Colors.grayBg,
    ...Typography.caption(),
  },
  errorText: {
    position: 'absolute',
    bottom: 4,
    left: 16,
    right: 16,
    ...Typography.small(),
  },
});

export default PhoneInput;
