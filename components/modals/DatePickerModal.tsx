import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Colors } from "@/theme";

interface DatePickerModalProps {
  visible: boolean;
  selectedDate: Date;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
  onClose: () => void;
}

export const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  selectedDate,
  onChange,
  onClose,
}) => (
  <Modal
    transparent={true}
    animationType="slide"
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalContainer}>
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="inline"
          onChange={onChange}
          locale="ru-RU"
          style={styles.dateTimePicker}
        />
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "black",
    borderRadius: 50,
    padding: 16,
  },
  dateTimePicker: {
    backgroundColor: "black",
  },
}); 