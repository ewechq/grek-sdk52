import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput,} from 'react-native';
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
import { PriceCalculation } from '@/components/blocks/tickets/PriceCalculation';
import { CheckboxWithLink } from '@/components/CheckboxWithLink';

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
      const message = 'Пожалуйста, заполните все обязательные поля:\n\n' +
        (!(guestCounts.onetofour > 0 || guestCounts.fivetosixteen > 0) ? '- Укажите количество билетов\n' : '') +
        (!formData.name || !formData.phone || !formData.email ? '- Заполните все персональные данные\n' : '') +
        (!agreements.privacy || !agreements.rules || !agreements.offer ? '- Примите все условия' : '');
      
      setAlertMessage(message);
      setAlertVisible(true);
      return;
    }

    try {
      const requestData = {
        "name": formData.name,
        "phone": "+" + formData.phone.replace(/\D/g, ''),
        "email": formData.email,
        "childage": [] as string[]
      };

      // Проверяем значения перед добавлением
      console.log('Начальные значения:', {
        onetofour: guestCounts.onetofour,
        fivetosixteen: guestCounts.fivetosixteen
      });

      // Добавляем с проверкой
      if (guestCounts.onetofour > 0) {
        for (let i = 0; i < guestCounts.onetofour; i++) {
          requestData.childage.push("1-4");
        }
      }
      console.log('После добавления 1-4:', requestData.childage);

      if (guestCounts.fivetosixteen > 0) {
        for (let i = 0; i < guestCounts.fivetosixteen; i++) {
          requestData.childage.push("5-16");
        }
      }
      console.log('После добавления 5-16:', requestData.childage);

      // Проверяем финальные данные
      console.log('Финальный объект для отправки:', JSON.stringify(requestData, null, 2));

      // Прямо перед отправкой
      const requestBody = JSON.stringify(requestData);
      console.log('Тело запроса:', requestBody);

      const response = await fetch('https://api.grekland.ru/api/ticket/preorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody
      });

      // Логируем ответ сразу после получения
      console.log('Статус ответа:', response.status);
      const responseText = await response.text();
      console.log('Сырой ответ:', responseText);

      const result = JSON.parse(responseText);
      console.log('Распарсенный ответ:', result);

      if (response.ok && result.link) {
        console.log('Успешный ответ:', result.message);
        console.log('Ссылка для оплаты:', result.link);
        
        // Перенаправляем на страницу оплаты
        router.push({
          pathname: '/(buyticket)/payment',
          params: { url: result.link }
        });
      } else {
        // Показываем ошибку
        const errorMessage = result.message || 'Произошла ошибка при создании заказа';
        console.error('Ошибка от сервера:', errorMessage);
        setAlertMessage(errorMessage);
        setAlertVisible(true);
      }
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
      setAlertMessage('Не удалось отправить запрос. Проверьте подключение к интернету');
      setAlertVisible(true);
    }
  };

  const { prices, isLoading } = useTicketPrices();

  return (
    <ScrollView style={styles.container}>
      <Header 
        title="Купить билет" 
        marginTop={48}
        onPress={() => router.push('/(tabs)')}
      />


      {/* Дата посещения */}
      <View style={{marginVertical:40, marginHorizontal:16}}>
        <Text style={styles.sectionTitle}>Дата посещения</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formattedDate}</Text>
          <Ionicons name="calendar-clear-outline" size={16} color={Colors.grayText} />
        </View>
      </View>



      {/* Персональные данные */}
      <View style={{marginBottom:40, marginHorizontal:16}}>
      <Text style={[styles.sectionTitle, {marginBottom:8}]}>Ваши данные:</Text>
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
        <Text style={[styles.sectionTitle, {marginBottom:24}]}>Считаем стоимость билетов</Text>
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
          label="политикой в отношении обработки персональных данных"
          url="https://grekland.ru/privacy.html"
        />
        <CheckboxWithLink
          checked={agreements.rules}
          onCheck={() => setAgreements({...agreements, rules: !agreements.rules})}
          label="правилами парка"
          url="https://grekland.ru/regulations.html"
        />
        <CheckboxWithLink
          checked={agreements.price}
          onCheck={() => setAgreements({...agreements, price: !agreements.price})}
          label="прайс листом"
          url="https://grekland.ru/ticket.html"
        />
        <CheckboxWithLink
          checked={agreements.offer}
          onCheck={() => setAgreements({...agreements, offer: !agreements.offer})}
          label="публичной офертой"
          url="https://grekland.ru/public-offer.html"
        />
      </View>

      {/* Кнопка подтверждения */}
      <View style={{marginHorizontal:16}}>
        <Btn
          title="Подтвердить"
          onPress={handleSubmit}
          width="full"
          bgColor={Colors.purple}
        />
        <View style={{paddingBottom:40, marginTop:10}}>
          <TextButton
            title="Почему не прошла скидка?"
            onPress={() => {}}
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
    paddingVertical: 16,
    
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
  counterSection: {
    marginTop: 40,
  },
  countersContainer: {
    gap: 4,
  },
  counterRow: {
    width: '100%',
    paddingHorizontal:16
  },
  text: {
    ...TextStyles.text,
    color: Colors.black,
    marginBottom: 16,
  },
  priceCalculationContainer: {
    marginBottom: 40,
    borderRadius: 25,
    backgroundColor: Colors.grayBg,
    paddingHorizontal: 16,
    paddingVertical: 28,
    marginHorizontal: 16
  },
});

export default BuyTicket;