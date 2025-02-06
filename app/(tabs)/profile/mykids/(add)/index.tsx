import { StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import HeaderInner from "@/components/Header";
import { TextStyles, Colors } from "@/theme";
import DatePickerWithIcon from '@/components/inputs/InputDatePicker';
import ImagePicker from '@/components/inputs/InputAddImage';
import { RadioButton } from '@/components/btns/RadioButton';
import DropDownPicker from 'react-native-dropdown-picker';
import { TextInput } from 'react-native';
import Btn from '@/components/btns/Btn';
import Entypo from '@expo/vector-icons/Entypo';

const AddChild = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'Матерью', value: 'mother'},
    {label: 'Отцом', value: 'father'},
    {label: 'Сестрой', value: 'sister'},
    {label: 'Братом', value: 'brother'},
    {label: 'Тетей', value: 'aunt'},
    {label: 'Дядей', value: 'uncle'},
    {label: 'Бабушкой', value: 'grandmother'},
    {label: 'Дедушкой', value: 'grandfather'},
  ]);

  const [hasDisability, setHasDisability] = useState(false);

  return (
    <View style={styles.container}>
      
      <View style={styles.content}>
      <HeaderInner title="Добавить ребенка" marginTop={0} />
        <TextInput
          style={styles.input}
          placeholder="ФИО ребенка"
          placeholderTextColor={Colors.grayText}
        />

        <DatePickerWithIcon 
          placeholder="Дата рождения"
        />

        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
          placeholder="Выберите кем являетесь ребенку..."
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholderStyle={styles.dropdownPlaceholder}
          zIndex={3000}
          zIndexInverse={1000}
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
          
          ArrowDownIconComponent={({style}) => (
            <View style={styles.arrowContainer}>
              <Entypo name="chevron-thin-down" size={14} color={Colors.grayText} />
            </View>
          )}
          ArrowUpIconComponent={({style}) => (
            <View style={styles.arrowContainer}>
              <Entypo name="chevron-thin-down" size={14} color={Colors.grayText} />
            </View>
          )}
        />

        <ImagePicker
          maxImages={1}
          placeholder="Выбрать фото..."
        />
        <View style={{flexDirection:'row',  alignItems:'center', gap:16,}}>
        <Text style={styles.label}>Инвалидность:</Text>
        <View style={styles.radioGroup}>
          <RadioButton
            selected={!hasDisability}
            onSelect={() => setHasDisability(false)}
            label="Нет"
          />
          <RadioButton
            selected={hasDisability}
            onSelect={() => setHasDisability(true)}
            label="Да"
          />
        </View>
        </View>
        
      </View>
      <Btn title="Подтвердить" onPress={() => {}} width='full'/>
    </View>
  )
}

export default AddChild

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grayBg,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: Colors.white,
    borderRadius: 25,
    marginBottom: 20,
    flex: 0,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: Colors.grayElements,
    marginBottom: 16,
    paddingHorizontal: 16,
    ...TextStyles.text,
    color: Colors.black,
  },
  dropdown: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: Colors.grayElements,
    height: 50,
    backgroundColor: 'transparent',
  },
  dropdownText: {
    ...TextStyles.text,
    color: Colors.black,
    paddingLeft:6
  },
  dropdownContainer: {
    backgroundColor: Colors.yellow,
    borderWidth: 0,
    borderRadius:25,
    marginTop: 0,
    height: undefined,
  },
  dropdownPlaceholder: {
    ...TextStyles.text,
    color: Colors.grayText,
  },
  label: {
    ...TextStyles.text,
    color: Colors.black,
    paddingLeft:16
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 24,
  },

  arrowContainer: {
    paddingRight: 7,
  },
}) 