import React, { useState, useEffect, useRef } from "react";
import { TextInput, View, StyleSheet } from "react-native";
import { TextStyles, Colors } from "@/theme";
const formatPhoneNumber = (text: string) => {
  let cleaned = text.replace(/\D+/g, "");

  if (cleaned && cleaned[0] !== "7") {
    cleaned = "7" + cleaned;
  }

  cleaned = cleaned.slice(0, 11);

  const match = cleaned.match(/^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
  if (match) {
    return [
      `+${match[1]}`,
      match[2] ? ` (${match[2]})` : "",
      match[3] ? ` ${match[3]}` : "",
      match[4] ? `-${match[4]}` : "",
      match[5] ? `-${match[5]}` : "",
    ].join("");
  }
  return cleaned;
};

const getCleanNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D+/g, "");
  return cleaned.length > 0 ? cleaned : "7";
};

interface PhoneInputProps {
  initialValue?: string;
  onPhoneChange?: (phone: string) => void;
  backgroundColor?: string;
  borderColor?: string;
  borderBottomWidth?: number;
  placeholder?: string;
  placeholderColor?: string;
  textColor?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  initialValue = "",
  onPhoneChange,
  backgroundColor = Colors.white,
  borderColor = Colors.grayElements,
  borderBottomWidth = 1,
  placeholder = "+7 (__) ___-__-__",
  placeholderColor = Colors.grayText,
  textColor = Colors.black,
}) => {
  const [phone, setPhone] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handlePhoneChange = (text: string) => {
    const rawText = text.replace(/[^\d+() -]/g, "");
    setPhone(rawText);
  
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  
    timeoutRef.current = setTimeout(() => {
      const formattedPhone = formatPhoneNumber(rawText);
      setPhone(formattedPhone);
      const cleanNumber = getCleanNumber(formattedPhone);
      if (onPhoneChange && cleanNumber.length === 11) {
        onPhoneChange(cleanNumber);
      }
    }, 300);
  };
  
  
  
  

  const handleFocus = () => {
    if (!phone) {
      setPhone("+7 (__) ___-__-__");
    }
  };

  const handleBlur = () => {
    if (phone === "+7 (__) ___-__-__") {
      setPhone("");
    }
  };

  useEffect(() => {
    if (initialValue) {
      const formattedInitial = formatPhoneNumber(initialValue);
      setPhone(formattedInitial);
    }
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <View>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor,
            
            borderBottomWidth,
            color: textColor,
          },
        ]}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        keyboardType="numeric"
        value={phone}
        onChangeText={handlePhoneChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        maxLength={18}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 16,
    ...TextStyles.text,
    borderColor: Colors.grayElements,
    color: Colors.black,
  },
});

export default PhoneInput;
