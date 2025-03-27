import React, { useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Colors, TextStyles } from '@/theme';

interface SmsCodeInputProps {
  codeLength: number;
  code: string[];
  onChange: (text: string, index: number) => void;
}

export const SmsCodeInput: React.FC<SmsCodeInputProps> = ({ 
  codeLength, 
  code, 
  onChange
}) => {
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Устанавливаем ссылки сразу после рендеринга
  useEffect(() => {
    // Заполняем массив пустыми ссылками если нужно
    while (inputRefs.current.length < codeLength) {
      inputRefs.current.push(null);
    }
  }, [codeLength]);

  const handleChange = (text: string, index: number) => {
    onChange(text, index);
    
    // Если введена цифра, переходим к следующему полю
    if (text.length === 1 && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (event: any, index: number) => {
    // Если нажат Backspace и поле пустое, фокусируемся на предыдущем поле
    if (event.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.codeContainer}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={ref => {
            inputRefs.current[index] = ref;
          }}
          style={[
            styles.codeInput,
            digit && styles.codeInputFilled
          ]}
          value={digit}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          keyboardType="numeric"
          maxLength={1}
          selectTextOnFocus
          onFocus={() => {
            inputRefs.current[index]?.setNativeProps({
              selection: { start: 0, end: 1 }
            });
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
  },
  codeInput: {
    width: 45,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.grayElements,
    backgroundColor: Colors.white,
    textAlign: 'center',
    ...TextStyles.h2,
    color: Colors.black,
  },
  codeInputFilled: {
    borderColor: Colors.purple,
    backgroundColor: Colors.purpleLight,
  },
}); 