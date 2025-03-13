import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Image} from 'react-native';
import { TextStyles, Colors } from '@/theme';
import Btn from '@/components/btns/Btn';
import PhoneInput from '@/components/inputs/InputPhone';
import EmailInput from '@/components/inputs/InputEmail';
import Header from '@/components/Header';
import Ionicons from '@expo/vector-icons/Ionicons';
import TextButton from '@/components/btns/BtnDownlineText';
import { useRouter } from 'expo-router';
import Counter from '@/components/CounterComponent';
import CustomAlert from '@/components/modals/CustomAlert';
import { useTicketPrices } from '@/hooks/useTicketPrices';
import { PriceCalculation } from '@/widgets/tickets/PriceCalculation';
import { CheckboxWithLink } from '@/components/CheckboxWithLink';
import { normalize } from '@/utils/responsive';
import DiscountModal from '@/components/modals/DiscountsModal';

const BuyTicket = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [guestCounts, setGuestCounts] = useState({
    onetofour: 0,
    fivetosixteen: 0,
  });

  const [selectedDiscounts, setSelectedDiscounts] = useState<string[]>([]);
  const [agreements, setAgreements] = useState({
    privacy: false,
    rules: false,
    offer: false,
    price: false,
  });
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [DiscountModalVisible, setDiscountModalVisible] = useState(false);

  // Добавляем состояние для хранения данных формы глобально
  interface TicketData {
    name: string;
    phone: string;
    email: string;
    childage: string[];
  }
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [signatureId, setSignatureId] = useState<string | null>(null);

  // Форматируем текущую дату
  const today = new Date();
  const formattedDate = today.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const router = useRouter();
  
  // Функция проверки валидности формы
  const isFormValid = () => {
    // Проверка заполнения всех полей
    const isPersonalDataFilled = formData.name.trim() && 
                                formData.phone.trim() && 
                                formData.email.trim();
    
    // Проверка количества билетов (хотя бы один билет)
    const hasTickets = guestCounts.onetofour > 0 || guestCounts.fivetosixteen > 0;
    
    // Проверка согласия со всеми условиями
    const isAgreementsAccepted = agreements.privacy && 
                                agreements.rules && 
                                agreements.offer;

    return isPersonalDataFilled && hasTickets && isAgreementsAccepted;
  };

  // Обработчик нажатия кнопки "Подтвердить"
  const handleSubmit = async () => {
    if (!isFormValid()) {
      console.log('Форма не валидна:', {
        hasTickets: guestCounts.onetofour > 0 || guestCounts.fivetosixteen > 0,
        personalDataFilled: formData.name && formData.phone && formData.email,
        agreementsAccepted: agreements.privacy && agreements.rules && agreements.offer
      });
      return;
    }

    try {
      const requestData = {
        "name": formData.name,
        "phone": "+" + formData.phone.replace(/\D/g, ''),
        "email": formData.email,
        "childage": [] as string[]
      };

      // Добавляем билеты в массив
      if (guestCounts.onetofour > 0) {
        for (let i = 0; i < guestCounts.onetofour; i++) {
          requestData.childage.push("1-4");
        }
      }

      if (guestCounts.fivetosixteen > 0) {
        for (let i = 0; i < guestCounts.fivetosixteen; i++) {
          requestData.childage.push("5-16");
        }
      }

      console.log('Отправляем данные:', requestData);

      // Сохраняем данные для последующей отправки
      setTicketData(requestData);

      // Отправляем запрос на подтверждение номера
      const signatureResponse = await fetch('https://api.grekland.ru/api/ticket/signature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          phone: requestData.phone
        })
      });

      const signatureResult = await signatureResponse.json();
      console.log('Ответ от сервера signature:', signatureResult);

      if (signatureResponse.ok && signatureResult.signature?.id) {
        // Сохраняем ID подписи из правильного места в ответе
        const newSignatureId = signatureResult.signature.id;
        console.log('ID подписи:', newSignatureId);
        
        try {
          // Переходим на страницу подтверждения SMS с параметрами сразу
          router.push({
            pathname: '/(buyticket)/sms',
            params: { 
              signatureId: newSignatureId,
              ticketData: JSON.stringify(requestData)
            }
          });
        } catch (navigationError) {
          console.error('Ошибка при навигации:', navigationError);
        }
      } else {
        console.error('Ошибка при получении подписи:', signatureResult.message || 'Неизвестная ошибка');
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  };

  const { prices, isLoading } = useTicketPrices();

  return (
    <ScrollView style={styles.container}>
      <Header 
        title="Покупка билета" 
        marginTop={normalize(48)}
        onPress={() => router.push('/(tabs)')}
      />


      {/* Дата посещения */}
      <View style={{marginVertical: normalize(40), marginHorizontal: normalize(16), backgroundColor: Colors.grayBg, borderRadius: normalize(25), padding: normalize(16), flexDirection: 'row', alignItems: 'center', gap: normalize(16), paddingHorizontal: normalize(16)}}>
        <Text style={{fontSize: 16}}>⚠️</Text>
        <Text style={{...TextStyles.h3, color: Colors.black,   paddingRight: normalize(16)}}> Сейчас билеты можно приобрести только на текущую дату</Text>
        
      </View>



      {/* Персональные данные */}
      <View style={{marginBottom: normalize(40), marginHorizontal: normalize(16)}}>
      <Text style={[styles.sectionTitle, {marginBottom: normalize(8)}]}>Ваши данные:</Text>
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
          <View style={styles.counterSection}>
            <Text style={styles.sectionTitle}>Количество билетов:</Text>           
            <View style={styles.countersContainer}>
              <View style={styles.counterRow}>
                <Counter
                  label="От 1 до 4 лет:"
                  value={guestCounts.onetofour}
                  onIncrease={() => setGuestCounts({...guestCounts, onetofour: guestCounts.onetofour + 1})}
                  onDecrease={() => setGuestCounts({...guestCounts, onetofour: Math.max(0, guestCounts.onetofour - 1)})}
                />
              </View>
              <View style={styles.counterRow}>
                <Counter
                  label="От 5 до 16 лет:"
                  value={guestCounts.fivetosixteen}
                  onIncrease={() => setGuestCounts({...guestCounts, fivetosixteen: guestCounts.fivetosixteen + 1})}
                  onDecrease={() => setGuestCounts({...guestCounts, fivetosixteen: Math.max(0, guestCounts.fivetosixteen - 1)})}
                />
              </View>
            </View>
          </View>

      </View>

 

      {/* Итоговая стоимость */}
      <View style={styles.priceCalculationContainer}>
        <Image source={require('@/assets/images/pattern.png')} style={{width: "110%", height: "200%", position: 'absolute', top: 0, left: 0, tintColor: 'rgba(0, 0, 0, 0.1)'}} />
        <Text style={[styles.sectionTitle, {marginBottom: normalize(24)}]}>Считаем стоимость билетов</Text>
        <PriceCalculation 
          youngChildrenCount={guestCounts.onetofour}
          olderChildrenCount={guestCounts.fivetosixteen}
          prices={prices}
        />
      </View>

      {/* Соглашения */}
      <View style={styles.agreementsSection}>
        <CheckboxWithLink
          checked={agreements.privacy}
          onCheck={() => setAgreements({...agreements, privacy: !agreements.privacy})}
          label="Политикой в отношении обработки персональных данных"
          url="https://grekland.ru/privacy.html"
        />
        <CheckboxWithLink
          checked={agreements.rules}
          onCheck={() => setAgreements({...agreements, rules: !agreements.rules})}
          label="Правилами парка"
          url="https://grekland.ru/regulations.html"
        />
        <CheckboxWithLink
          checked={agreements.price}
          onCheck={() => setAgreements({...agreements, price: !agreements.price})}
          label="Прайс листом"
          url="https://grekland.ru/ticket.html"
        />
        <CheckboxWithLink
          checked={agreements.offer}
          onCheck={() => setAgreements({...agreements, offer: !agreements.offer})}
          label="Публичной офертой"
          url="https://grekland.ru/public-offer.html"
        />
      </View>

      {/* Кнопка подтверждения */}
      <View style={{marginHorizontal: normalize(16)}}>
        <Btn
          title="Подтвердить"
          onPress={handleSubmit}
          width="full"
          bgColor={Colors.green}
          textColor={Colors.black}
        />
        <View style={{paddingBottom: normalize(40), marginTop: normalize(10)}}>
          <TextButton
            title="Почему не прошла скидка?"
            onPress={() => setDiscountModalVisible(true)}
            color={Colors.black}
          />
        </View>
      </View>

      <CustomAlert
        visible={alertVisible}
        title="Ошибка!"
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />

      <DiscountModal
        isVisible={DiscountModalVisible}
        onClose={() => setDiscountModalVisible(false)}
      />
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
    padding: normalize(16),
    borderRadius: normalize(40),
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(16),
    marginBottom: normalize(40),
    margin: normalize(16)
  },
  warningText: {
    ...TextStyles.h3,
    color: Colors.black,
  },
  sectionTitle: {
    ...TextStyles.h2,
    color: Colors.black,
    marginBottom: normalize(8),
  },
  selectBox: {
    borderWidth: 1,
    borderColor: Colors.grayText,
    borderRadius: normalize(8),
    padding: normalize(12),
    marginBottom: normalize(20),
  },
  selectText: {
    ...TextStyles.text,
    color: Colors.grayText,
  },
  input: {
    ...TextStyles.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayElements,
    paddingHorizontal: normalize(16),
    marginBottom: normalize(8),
    paddingVertical: normalize(16),
  },
  radioGroup: {
    marginBottom: normalize(20),
  },
  childrenTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: normalize(8),
    marginBottom: normalize(20),
  },
  tag: {
    backgroundColor: Colors.purple,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    borderRadius: normalize(20),
  },
  tagText: {
    color: Colors.white,
    ...TextStyles.text,
  },
  discountsSection: {
    marginHorizontal: normalize(16),
    borderRadius: normalize(25),
    backgroundColor: Colors.grayBg,
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(28)
  },
  discountDescription: {
    color: Colors.grayText,
    marginBottom: normalize(24),
    ...TextStyles.text,
  },
  discountButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: normalize(8),
  },
  totalSection: {
    marginBottom: normalize(40),
    borderRadius: normalize(25),
    backgroundColor: Colors.grayBg,
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(28),
    marginHorizontal: normalize(16)
  },
  agreementsSection: {
    marginBottom: normalize(40),
    marginHorizontal: normalize(16)
  },
  helpLink: {
    color: Colors.purple,
    textAlign: 'center',
    marginTop: normalize(12),
    marginBottom: normalize(20),
    ...TextStyles.text,
  },
  dropdown: {
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: Colors.grayElements,
    marginBottom: normalize(16),
    height: normalize(40),
    paddingHorizontal: normalize(16),
    borderRadius: 0,
  },
  dropdownContainer: {
    borderWidth: 0,
    borderRadius: normalize(25),
    backgroundColor: Colors.yellow,
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(10),
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayElements
  },
  dateText: {
    ...TextStyles.text,
    color: Colors.black,
  },
  counterSection: {
    marginTop: normalize(40),
  },
  countersContainer: {
    gap: normalize(4),
  },
  counterRow: {
    width: '100%',
    paddingHorizontal: normalize(16)
  },
  text: {
    ...TextStyles.text,
    color: Colors.black,
    marginBottom: normalize(16),
  },
  priceCalculationContainer: {
    marginBottom: normalize(40),
    borderRadius: normalize(25),
    backgroundColor: Colors.grayBg,
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(28),
    marginHorizontal: normalize(16),
    overflow: 'hidden'
  },
  horizontalLine: {
    width: "100%",
    height: normalize(2),
    backgroundColor: Colors.grayElements,
    borderRadius: normalize(1),
    marginTop: normalize(8),
    marginBottom: normalize(8)
  },
});

export default BuyTicket;