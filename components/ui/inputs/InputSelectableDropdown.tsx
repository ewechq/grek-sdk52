import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DropDownPicker from "react-native-dropdown-picker";
import { TextStyles, Colors } from '@/theme';
import { Ionicons } from '@expo/vector-icons';


interface SelectableDropdownProps {
  placeholder: string;
  items: Array<{ label: string; value: string }>;
  selectedItems: string[];
  onSelect: (items: string[]) => void;
  tagColor?: string;        // цвет фона тега
  tagTextColor?: string;    // цвет текста в теге
  dropdownColor?: string;   // цвет выпадающего списка
}

const SelectableDropdown: React.FC<SelectableDropdownProps> = ({
  placeholder,
  items,
  selectedItems,
  onSelect,
  tagColor = Colors.purple,
  tagTextColor = Colors.white,
  dropdownColor = Colors.yellow,
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);

  const handleSelect = (selectedValue: string | null) => {
    if (selectedValue) {
      onSelect([...selectedItems, selectedValue]);
      setValue(null);
      setOpen(false);
    }
  };

  const handleRemove = (itemToRemove: string) => {
    onSelect(selectedItems.filter(item => item !== itemToRemove));
  };

  const availableItems = items.filter(item => !selectedItems.includes(item.value));

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={availableItems}
        setOpen={setOpen}
        setValue={setValue}
        onSelectItem={(item) => handleSelect(item.value)}
        placeholder={placeholder}
        style={styles.dropdown}
        dropDownContainerStyle={[
          styles.dropdownContainer,
          { backgroundColor: dropdownColor }
        ]}
        placeholderStyle={styles.placeholder}
        textStyle={styles.textStyle}
        tickIconStyle={styles.icon}
        arrowIconStyle={styles.iconArrow}
        listMode="SCROLLVIEW"
      />
      
      <View style={styles.tagsContainer}>
        {selectedItems.map((item, index) => (
          <View 
            key={index} 
            style={[
              styles.tag,
              { backgroundColor: tagColor }
            ]}
          >
            <Text style={[styles.tagText, { color: tagTextColor }]}>
              {item}
            </Text>
            <TouchableOpacity onPress={() => handleRemove(item)}>
              <Ionicons name="close" size={16} color={tagTextColor} />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  dropdown: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: Colors.grayElements,
    marginBottom: 24,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 0,

  },
  dropdownContainer: {
    borderWidth: 0,
    borderRadius: 25,
    backgroundColor: Colors.yellow,
    paddingHorizontal: 8,
    paddingVertical: 10,

  },
  placeholder: {
    color: Colors.grayText,
    ...TextStyles.text,
  },
  textStyle: {
    color: Colors.black,
    ...TextStyles.text,
  },
  icon: {
    tintColor: Colors.black,
  },
  iconArrow: {
    tintColor: Colors.grayText,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  tag: {
    backgroundColor: Colors.purple,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagText: {
    color: Colors.white,
    ...TextStyles.h3,
  },
});

export default SelectableDropdown; 