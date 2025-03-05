import React, { useState } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";

import { TextStyles, Colors } from "@/theme";

const isValidEmail = (email: string) => {
  // Простое регулярное выражение для проверки электронной почты
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

interface EmailInputProps {
  value: string;
  onChange: (text: string) => void;
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
  backgroundColor = Colors.white,
  placeholderColor = Colors.grayText,
  textColor = Colors.black,
  errorColor = 'red'
}) => {
  const [isEmailValid, setIsEmailValid] = useState(true);

  const handleEmailChange = (text: string) => {
    onChange(text);
    setIsEmailValid(isValidEmail(text) || text === "");
  };

  return (
    <View >
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor,
            
            
            color: textColor
          }
        ]}
        placeholder="Введите эл. почту"
        placeholderTextColor={placeholderColor}
        keyboardType="email-address"
        value={value}
        onChangeText={handleEmailChange}
        autoCapitalize="none"
      />
      {!isEmailValid && (
        <Text style={[styles.errorText, { color: errorColor }]}>
          Введите корректный адрес электронной почты
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
    marginBottom: 16,
    color: Colors.black,
    ...TextStyles.text,
    borderColor: Colors.grayElements,
  },
  errorText: {
    position: 'absolute',
    bottom: -4,
    left: 16,
    ...TextStyles.text,
    fontSize: 12,
    color: Colors.pink,
  },
});

export default EmailInput;
