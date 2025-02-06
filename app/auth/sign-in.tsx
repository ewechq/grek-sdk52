import React, { useState } from "react";
import { 
  View, 
  Text, 
  Alert, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ImageBackground
} from "react-native";
import { Image } from 'expo-image';
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
import { TextStyles, Colors } from '@/theme'
import Btn from '@/components/btns/Btn'
import TextButton from '@/components/btns/BtnDownlineText'
import PhoneInput from '@/components/inputs/InputPhone'
import SmsInput from '@/components/inputs/InputSms'
import { useAuth } from '@/contexts/auth';

const { height } = Dimensions.get('window');

const PhoneAuthScreen = () => {
  const router = useRouter();
  const { signIn } = useAuth();
  const [phone, setPhone] = useState("");
  const [smsCode, setSmsCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendPhoneNumber = async () => {
    try {
      console.log("Отправляемый номер телефона:", phone);
      const response = await fetch(
        `https://api.grekland.ru/api/getCode?phone=${phone}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.ok) {
        setIsCodeSent(true);
        console.log("Код отправлен пользователю.");
        const data = await response.json();
        console.log(data);
        console.log(data.message);
      }
    } catch (error) {
      console.error("Ошибка при отправке номера:", error);
      Alert.alert("Ошибка", "Не удалось отправить код. Попробуйте снова.");
    }
  };

  const authenticateUser = async () => {
    try {
      const response = await fetch("https://api.grekland.ru/api/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone,
          sms_code: smsCode,
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка авторизации');
      }

      const data = await response.json();
      const token = data?.access_token;

      if (!token) {
        Alert.alert("Ошибка", "Не удалось получить токен.");
        return;
      }

      await signIn(token);
    } catch (error) {
      console.error("Ошибка внутри аутентификации:", error);
      Alert.alert("Ошибка", "Не удалось войти. Проверьте код.");
    }
  };

  const handleMainButtonPress = () => {
    if (!isCodeSent) {
      sendPhoneNumber();
    } else {
      authenticateUser();
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.backgroundContainer}>
        <Image
          source={require('@/assets/images/grekopenthedoor.png')}
          style={styles.backgroundImage}
          contentFit="contain"
        />
      </View>
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.containerInside}>
            <Text style={styles.title}>
              {!isCodeSent 
                ? "Чтобы войти введите номер телефона:" 
                : "Введите код \nиз СМС:"
              }
            </Text>

            {!isCodeSent ? (
              <View style={{paddingBottom:5}}>
                <PhoneInput
                  initialValue={phone}
                  onPhoneChange={(number) => setPhone(number)}
                />
              </View>
            ) : (
              <SmsInput
                value={smsCode}
                onChange={setSmsCode}
                error={error || undefined} 
              />
            )}

            <Btn
              title={!isCodeSent ? "Получить код" : "Войти"}
              onPress={handleMainButtonPress}
              bgColor={Colors.purple}
              textColor={Colors.white}
              width="full"
            />

            {isCodeSent && (
              <View style={{paddingTop:10}}>
                <TextButton
                  title="Назад"
                  onPress={() => {
                    setIsCodeSent(false);
                    setSmsCode("");
                  }}
                  color={Colors.black}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.purple,
  },
  backgroundContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '95%',
    height: '80%',
    marginBottom: height * 0.2,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  containerInside: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title: {
    color: Colors.black,
    ...TextStyles.h2,
    marginBottom: 20,
  },
  input: {
    backgroundColor: Colors.purple,
    color: Colors.white,
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 10,
    ...TextStyles.text
  }
});

export default PhoneAuthScreen;
