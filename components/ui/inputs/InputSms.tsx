import React from "react";
import { 
  TextInput, 
  View, 
  StyleSheet, 
  Text,
} from "react-native";
import { Typography, Colors } from "@/theme";

interface SmsInputProps {
  value: string;
  onChange: (text: string) => void;
  error?: string;
}

const SmsInput: React.FC<SmsInputProps> = ({ 
  value, 
  onChange, 
  error,
}) => {
  const handleChange = (text: string) => {
    // Очистка ввода от всех символов кроме цифр
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Проверка длины (6 символов)
    if (numericValue.length <= 6) {
      onChange(numericValue);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null
        ]}
        value={value}
        onChangeText={handleChange}
        placeholder="Введите код из СМС"
        placeholderTextColor={Colors.grayText}
        keyboardType="numeric"
        maxLength={6}
        autoFocus={true}
        caretHidden={false}
        selectTextOnFocus={true}
        autoComplete="sms-otp"
        textContentType="oneTimeCode"
        contextMenuHidden={true}
      />
      
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  input: {
    backgroundColor: Colors.white,
    height: 50,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: Colors.grayElements,
    color: Colors.black,
    marginBottom:8
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.red,
  },
  errorText: {
    ...Typography.small(),
    color: Colors.red,
    marginTop: -5,
    marginBottom: 10,
    marginLeft: 20,
  }
});

export default SmsInput; 