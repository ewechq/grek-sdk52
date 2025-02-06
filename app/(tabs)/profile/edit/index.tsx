import {
  StyleSheet,
  TextInput,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import DatePicker from "@/components/inputs/InputDatePicker";
import DropDownPicker from "react-native-dropdown-picker";
import PhoneInput from "@/components/inputs/InputPhone";
import EmailInput from "@/components/inputs/InputEmail";
import Btn from "@/components/btns/Btn";
import { useRouter } from "expo-router";
import ImagePicker from "@/components/images/ImagePicker";
import * as SecureStore from 'expo-secure-store';
import { Entypo, Ionicons } from '@expo/vector-icons';
import Modal from 'react-native-modal';
import { TextStyles,Colors } from "@/theme";

interface UserData {
  id: number;
  name: string | null;
  email: string | null;
  phone: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

const EditProfileScreen = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [phone, setPhone] = useState<string>("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([
    { label: "Пушкина 77", value: "Пушкина 77" },
    { label: "Колотушкина 88", value: "Колотушкина 88" },
  ]);
  const [email, setEmail] = useState<string>("");

  const statusItems = [
    { label: "Многодетный", value: "many_children" },
    { label: "Обычный", value: "regular" },
  ];

  const addressesWithAdd = [
    ...addresses,
    {
      label: "Добавить адрес",
      value: "add_address",
      icon: () => <Ionicons name="add-circle-outline" size={20} color={Colors.purple} />
    }
  ];

  const handleAddressSelect = (value: string | null) => {
    if (value === 'add_address') {
      setAddress(null);
      setOpen(false);
      setModalVisible(true);
    } else {
      setAddress(value);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await SecureStore.getItemAsync('authToken');
        
        if (!token) {
          console.error('Токен не найден');
          router.push('/auth/sign-in');
          return;
        }

        console.log('Токен:', token); // Для отладки

        const response = await fetch('https://api.grekland.ru/api/user', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            await SecureStore.deleteItemAsync('authToken');
            router.push('/auth/sign-in');
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Данные пользователя:', data);
        setUserData(data);
        
        if (data.name) {
          setName(data.name);
        }
        if (data.phone) {
          setPhone(data.phone);
        }
        if (data.email) {
          setEmail(data.email);
        }

      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={{paddingBottom: 40}}><Header title="Мой профиль" /></View>
      
      
      <View style={styles.content}>
        <ImagePicker />
        
        <TextInput
          placeholder="ФИО"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor={Colors.grayText}
        />

        <DatePicker />
        
        <PhoneInput 
          initialValue={phone} 
          onPhoneChange={setPhone}
        />
        
        <EmailInput value={email} onChange={setEmail} />

        

        <View style={{marginBottom:32}}>
        <DropDownPicker
          open={statusOpen}
          value={status}
          items={statusItems}
          setOpen={setStatusOpen}
          setValue={setStatus}
          
          placeholder="Выберите статус..."
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContainer}
          placeholderStyle={styles.dropdownPlaceholder}
          zIndex={2000}
          zIndexInverse={1000}
          listMode="SCROLLVIEW"
          dropDownDirection="BOTTOM"
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
        /></View>

        <Btn title="Сохранить" width="full" onPress={() => {}}/>
      </View>

      <Modal
        isVisible={isModalVisible}
        onBackdropPress={() => setModalVisible(false)}
        style={{ margin: 0, justifyContent: 'flex-end' }}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Добавить адрес</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Введите адрес"
            placeholderTextColor={Colors.grayText}
          />
          <Btn
            title="Добавить"
            onPress={() => {
              setModalVisible(false);
            }}
            width="full"
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    
    
  },
  content: {
    marginBottom: 140,
    paddingHorizontal: 16,
  },
  input: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: Colors.grayElements,
    ...TextStyles.text,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  addressContainer: {
    marginBottom:16,
    flexDirection: 'row',
    alignItems: 'center',
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
    maxHeight: 150,
  },
  dropdownPlaceholder: {
    ...TextStyles.text,
    color: Colors.grayText,
  },
  arrowContainer: {
    paddingRight: 7,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.purple,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    height: 48,
    backgroundColor: Colors.purple,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    ...TextStyles.h2,
    color: Colors.white,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: Colors.white,
    padding: 16,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  modalTitle: {
    ...TextStyles.h2,
    marginBottom: 16,
  },
  modalInput: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: Colors.grayElements,
    marginBottom: 16,
    paddingHorizontal: 16,
    ...TextStyles.text,
  },
  modalButton: {
    height: 48,
    backgroundColor: Colors.purple,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    ...TextStyles.h2,
    color: Colors.white,
    fontWeight: 'bold',
  },
  placeholder: {
    color: Colors.grayText,
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
});

export default EditProfileScreen;
