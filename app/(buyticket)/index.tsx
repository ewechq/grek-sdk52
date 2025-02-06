import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import Btn from '@/components/btns/Btn';
import { RadioButton } from '@/components/btns/RadioButton';
import { Checkbox } from '@/components/Checkbox';
import PhoneInput from '@/components/inputs/InputPhone';
import EmailInput from '@/components/inputs/InputEmail';
import DropDownPicker from "react-native-dropdown-picker";
import Header from '@/components/Header';
import Ionicons from '@expo/vector-icons/Ionicons';
import SelectableDropdown from '@/components/inputs/InputSelectableDropdown';
import ToggleButton from '@/components/btns/BtnToggle';
import TextButton from '@/components/btns/BtnDownlineText';
import { useRouter } from 'expo-router';

const BuyTicket = () => {
  const [selectedPark, setSelectedPark] = useState('');
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [ticketType, setTicketType] = useState('park'); // 'park' или 'gift'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [selectedTariff, setSelectedTariff] = useState('weekday'); 
  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [agreements, setAgreements] = useState({
    privacy: false,
    rules: false,
    offer: false,
    additional: false,
  });
  const addresses = [
    { label: "Grek Land", value: "Grek Land" },
    { label: "Троя Парк", value: "Троя Парк" },
  ];

  const childrenOptions = [
    { label: "Александров Михаил Дмитриевич", value: "Александров Михаил Дмитриевич" },
    { label: "Ева Попова", value: "Ева Попова" },
    { label: "Константинопольский Артём Александрович", value: "Константинопольский Артём Александрович" },
    { label: "Мария К.", value: "Мария К." },
    { label: "Воробьёв-Деревянко Платон Сергеевич", value: "Воробьёв-Деревянко Платон Сергеевич" },
    { label: "Анна Иванова", value: "Анна Иванова" },
  ];

  const discountOptions = [
    { id: 'none', title: 'Нет' },
    { id: 'family', title: '50% большой семье' },
    { id: 'birthday', title: '50% именинникам' },
    { id: 'evening', title: '50% с 20:00 до 21:00' },
    { id: 'special', title: '50% особенным детям' },
  ];

  const handleDiscountToggle = (discountId: string) => {
    if (discountId === 'none') {
      setSelectedDiscounts(['none']);
      return;
    }
    
    setSelectedDiscounts(prev => {
      if (prev.includes('none')) {
        return [discountId];
      }
      if (prev.includes(discountId)) {
        return prev.filter(id => id !== discountId);
      }
      return [...prev, discountId];
    });
  };

  // Форматируем текущую дату
  const today = new Date();
  const formattedDate = today.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const router = useRouter();
  

  return (
    <ScrollView style={styles.container}>
      <Header 
        title="Купить билет" 
        marginTop={48}
        onPress={() => router.push('/(tabs)')}
      />
      {/* Предупреждение */}
      <View style={styles.warningBox}>
      <Ionicons name="warning-outline" size={24} color="black" />
        <Text style={styles.warningText}>
          Скидки не суммируются и предоставляются при предъявлении оригинальных документов
        </Text>
      </View>

      {/* Дата посещения */}
      <View style={{marginBottom:40, marginHorizontal:16}}>
        <Text style={styles.sectionTitle}>Дата посещения</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Ionicons name="calendar-clear-outline" size={16} color={Colors.grayText} />
        </View>
      </View>

      {/* Тип билета */}
      <View style={{marginBottom:40, marginHorizontal:16}}>
      <Text style={styles.sectionTitle}>Тип билета:</Text>
      <View style={styles.radioGroup}>
        <RadioButton
          selected={ticketType === 'park'}
          onSelect={() => setTicketType('park')}
          label="Билет в парк"
        />
        <RadioButton
          selected={ticketType === 'gift'}
          onSelect={() => setTicketType('gift')}
          label="Подарочный сертификат"
        />
      </View></View>

      {/* Персональные данные */}
      <View style={{marginBottom:40, marginHorizontal:16}}>
      <Text style={styles.sectionTitle}>Ваши данные:</Text>
      <TextInput
        style={styles.input}
        placeholder="Ваше ФИО"
        placeholderTextColor={Colors.grayText}
        value={formData.name}
        onChangeText={(text) => setFormData({...formData, name: text})}
      />
      <PhoneInput
        initialValue={formData.phone}
        onPhoneChange={(text) => setFormData({...formData, phone: text})}
        backgroundColor={Colors.white}
        borderColor={Colors.grayText}
      />
      <EmailInput
        value={formData.email}
        onChange={(text) => setFormData({...formData, email: text})}
        backgroundColor={Colors.white}
        borderColor={Colors.grayText}
      />


      {/* Выбор детей */}
      <SelectableDropdown
        placeholder="Выберите ребенка"
        items={childrenOptions}
        selectedItems={selectedChildren}
        onSelect={setSelectedChildren}
      />
      </View>

      {/* Тарифы */}
      <View style={{marginBottom:40, marginHorizontal:16}}>
      <Text style={styles.sectionTitle}>Тариф</Text>
      <View style={styles.radioGroup}>
        <RadioButton
          selected={selectedTariff === 'weekday'}
          onSelect={() => setSelectedTariff('weekday')}
          label="Будни"
        />
        <RadioButton
          selected={selectedTariff === 'weekend'}
          onSelect={() => setSelectedTariff('weekend')}
          label="Выходные и праздники"
        />
      </View>
      </View>
      {/* Скидки и льготы */}
      <View style={styles.discountsSection}>
        <Text style={styles.sectionTitle}>Скидки и льготы</Text>
        <Text style={styles.discountDescription}>
          Чтобы предоставить скидки попросим оригинальные документы, подтверждающие личность, статус или возраст ребёнка.
        </Text>
        <View style={styles.discountButtons}>
          {discountOptions.map((discount) => (
            <ToggleButton
              key={discount.id}
              title={discount.title}
              isSelected={selectedDiscounts.includes(discount.id)}
              onToggle={() => handleDiscountToggle(discount.id)}
            />
          ))}
          <Text style={{...TextStyles.textDescription, color:Colors.grayText, marginTop:16}}>
          *Скидки не распространяются на ресторан и праздники в банкетных комнатах. К категории «взрослые» относятся люди, достигшие 16 лет.        </Text>
        </View>
      </View>

      {/* Итоговая стоимость */}
      <View style={styles.totalSection}>
        <Text style={[styles.sectionTitle,{marginBottom:24}]}>Считаем стоимость билетов:</Text>
        <View style={{marginBottom:16}}>
        <Text style={{...TextStyles.text, color:Colors.black}}>1 - Имя Ребенка Папчество - 1 183₽</Text>
        <Text style={{...TextStyles.textDescription, color:Colors.grayText}}>30% большая семья</Text>
        </View>
        <View style={{marginBottom:16}}>
        <Text style={{...TextStyles.text, color:Colors.black}}>2 - Имя Ребенка Отчество - 1 183₽</Text>
        <Text style={{...TextStyles.textDescription, color:Colors.grayText}}>30% большая семья</Text>
        </View>
        <View style={{marginBottom:16}}>
        <Text style={{...TextStyles.text, color:Colors.black}}>3 - Имя Ребенка Отечество - 695₽</Text>
        <Text style={{...TextStyles.textDescription, color:Colors.grayText}}>50% именнинику</Text>
        </View>
        <View style={styles.horizontalLine} />
        <View style={{flexDirection:'row',  justifyContent:'space-between'}}>
          <Text style={{...TextStyles.h2, color:Colors.black}}>Итого:</Text>
          <Text style={{...TextStyles.h2, color:Colors.black}}>3 061₽</Text>
        </View>
      </View>

      {/* Соглашения */}
      <View style={styles.agreementsSection}>
        <Checkbox
          checked={agreements.privacy}
          onCheck={() => setAgreements({...agreements, privacy: !agreements.privacy})}
          label="Согласен(а) с политикой в отношении обработки персональных данных"
        />
        <Checkbox
          checked={agreements.rules}
          onCheck={() => setAgreements({...agreements, rules: !agreements.rules})}
          label="Согласен(а) с правилами парка"
        />
        <Checkbox
          checked={agreements.offer}
          onCheck={() => setAgreements({...agreements, offer: !agreements.offer})}
          label="Согласен(а) с публичной офертой"
        />
      </View>

      {/* Кнопка подтверждения */}
      <View style={{marginHorizontal:16}}>
      <Btn
        title="Подтвердить"
        onPress={() => {}}
        width="full"
        bgColor={Colors.purple}
      />
<View style={{paddingBottom:40, marginTop:10}}>
      <TextButton
            title="Почему не прошла скидка?"
            onPress={() => {}}
            color={Colors.black}

          /></View></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    
  },
  warningBox: {
    backgroundColor: Colors.yellow,
    padding: 16,
    borderRadius: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom:40,
    margin:16
  },
  warningText: {
    ...TextStyles.h3,
    color: Colors.black,
  },
  sectionTitle: {
    ...TextStyles.h2,
    color: Colors.black,
    marginBottom: 8,
  },
  selectBox: {
    borderWidth: 1,
    borderColor: Colors.grayText,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    
  },
  selectText: {
    ...TextStyles.text,
    color: Colors.grayText,
  },
  input: {
    ...TextStyles.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayElements,
    paddingHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 10,
    
  },
  radioGroup: {
    marginBottom: 20,
  },
  childrenTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: Colors.purple,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    color: Colors.white,
    ...TextStyles.text,
  },
  discountsSection: {
    marginHorizontal:16,
    borderRadius:25,
    backgroundColor:Colors.grayBg,
    paddingHorizontal:16,
    paddingVertical:28
  },
  discountDescription: {
    color: Colors.grayText,
    marginBottom: 24,
    ...TextStyles.text,
  },
  discountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  totalSection: {
    marginBottom: 40,
    borderRadius:25,
    backgroundColor:Colors.grayBg,
    paddingHorizontal:16,
    paddingVertical:28,
    marginHorizontal:16
  },
  agreementsSection: {
    marginBottom: 40,
    marginHorizontal:16
  },
  helpLink: {
    color: Colors.purple,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
    ...TextStyles.text,
  },
  iconArrow: {
    tintColor: Colors.grayText,
  },
  icon: {
    tintColor: Colors.black,
  },
  textStyle: {
    color: Colors.black,
  },
  dropdown: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: Colors.grayElements,
    
    marginBottom: 16,
    height: 40,
    paddingHorizontal: 16,
    borderRadius:0,
  },
  dropdownContainer: {
    borderWidth: 0,
borderRadius:25,
    backgroundColor: Colors.yellow,
    
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  placeholder: {
    color: Colors.grayText,
  },
  horizontalLine: {
    width: "100%",
    height: 2,
    backgroundColor: Colors.grayElements,
    borderRadius: 1,
    marginTop:8,
    marginBottom:8
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    padding: 16,
    borderBottomWidth:1,
    borderBottomColor:Colors.grayElements
  },
  dateText: {
    ...TextStyles.text,
    color: Colors.black,
  },
});

export default BuyTicket;