import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleProp, ViewStyle, TextStyle, Modal } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { MaskedTextInput } from 'react-native-mask-text';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TextStyles, Colors } from "@/theme";
import Btn from '../shared/ui/btns/Btn';

interface DatePickerProps {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  iconColor?: string;
  placeholder?: string;
  placeholderColor?: string;
  textColor?: string;
  borderColor?: string;
  backgroundColor?: string;
}

const DatePickerWithIcon = ({
  containerStyle,
  inputStyle,
  iconColor = Colors.grayText,
  placeholder = "Выберите дату",
  placeholderColor = Colors.grayText,
  textColor = Colors.black,
  borderColor = Colors.grayElements,
  backgroundColor = Colors.white,
}: DatePickerProps) => {
  const [date, setDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDate(selectedDate);
      const day = selectedDate.getDate().toString().padStart(2, '0');
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
      const year = selectedDate.getFullYear();
      setFormattedDate(`${day}/${month}/${year}`);
    }
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: backgroundColor,
          paddingHorizontal: 16,
          height: 50,
          borderBottomWidth: 1,
          borderColor: borderColor,
          marginBottom: 16,
        },
        containerStyle,
      ]}
    >
      <MaskedTextInput
        style={[
          {
            flex: 1,
            color: textColor,
            height: 50,
            ...TextStyles.text,
          },
          inputStyle,
        ]}
        mask="99/99/9999"
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={formattedDate}
        onChangeText={(text: string) => setFormattedDate(text)}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Ionicons
          name="calendar-clear-outline"
          size={16}
          color={iconColor}
          style={{ marginLeft: 10 }}
        />
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPicker}
          onRequestClose={() => setShowPicker(false)}
        >
          <TouchableOpacity
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            activeOpacity={1}
            onPress={() => setShowPicker(false)}
          >
            <View
              style={{
                backgroundColor: Colors.purple,
                padding: 16,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              }}
            >
              <DateTimePicker
                value={date}
                mode="date"
                display="spinner"
                onChange={onChange}
                style={{ height: 200 }}
                locale="ru-RU"
              />
              <View style={{ marginBottom: 16 }}>
                <Btn 
                  onPress={() => setShowPicker(false)} 
                  title="Готово"
                  textColor={Colors.white}
                  bgColor={Colors.pink}
                  width="full"
                />
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChange}
            locale="ru-RU"
          />
        )
      )}
    </View>
  );
};

export default DatePickerWithIcon;
