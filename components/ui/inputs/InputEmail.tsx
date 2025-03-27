import React, { useState, useEffect } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";

import { TextStyles, Colors } from "@/theme";

const isValidEmail = (email: string) => {
  // Проверяем наличие кириллицы
  if (/[а-яА-ЯёЁ]/.test(email)) {
    return false;
  }

  // Более строгая проверка email
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(email) && email.includes('.');
};

interface EmailInputProps {
  value: string;
  onChange: (text: string) => void;
  onValidityChange?: (isValid: boolean) => void;
  // Стилизация
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  placeholderColor?: string;
  textColor?: string;
  errorColor?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({ 
  value, 
  onChange,
  onValidityChange,
  backgroundColor = Colors.white,
  placeholderColor = Colors.grayText,
  textColor = Colors.black,
  errorColor = Colors.red
}) => {
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    const isValid = value === "" || isValidEmail(value);
    onValidityChange?.(isValid);
  }, [value, onValidityChange]);

  const handleEmailChange = (text: string) => {
    onChange(text);
    if (isTouched) {
      const isValid = text === "" || isValidEmail(text);
      setIsEmailValid(isValid);
      onValidityChange?.(isValid);
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
    const isValid = value === "" || isValidEmail(value);
    setIsEmailValid(isValid);
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
            borderColor: !isEmailValid && isTouched ? errorColor : Colors.grayElements,
            marginBottom: !isEmailValid && isTouched ? 24 : 12
          }
        ]}
        placeholder="Введите эл. почту"
        placeholderTextColor={placeholderColor}
        keyboardType="email-address"
        value={value}
        onChangeText={handleEmailChange}
        onBlur={handleBlur}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
      />
      {!isEmailValid && isTouched && (
        <Text style={[styles.errorText, { color: errorColor }]}>
          Введите корректный email (например: name@example.com)
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
    color: Colors.black,
    ...TextStyles.text,
  },
  errorText: {
    position: 'absolute',
    bottom: -16,
    left: 16,
    right: 16,
    ...TextStyles.textDescription,
  },
});

export default EmailInput;
