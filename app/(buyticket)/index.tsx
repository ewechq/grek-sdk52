import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Colors } from '@/theme';
import Btn from '@/components/ui/btns/Btn';
import Header from '@/components/ui/layout/Header';
import TextButton from '@/components/ui/btns/BtnDownlineText';
import { useRouter } from 'expo-router';
import { Alert } from '@/components/ui/modals/Alert';
import { DiscountsModal } from '@/components/ui/modals/DiscountsModal';
import { useTicketPrices } from '@/hooks/useTicketPrices';
import { PriceCalculation } from '@/widgets/tickets/PriceCalculation';
import { normalize } from '@/utils/responsive';
import { DateWarning } from '@/components/pages/buyticket/DateWarning';
import { PersonalDataForm } from '@/widgets/buyticket/PersonalDataForm';
import { AgreementsBlock } from '@/widgets/buyticket/AgreementsBlock';
import { useBuyTicketForm } from '@/hooks/buyticket/useBuyTicketForm';

const BuyTicket = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [DiscountModalVisible, setDiscountModalVisible] = useState(false);
  const [isNameValid, setIsNameValid] = useState(true);
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const router = useRouter();
  
  const {
    formData,
    setFormData,
    guestCounts,
    setGuestCounts,
    agreements,
    setAgreements,
    handleSubmit
  } = useBuyTicketForm();

  const { prices, isLoading } = useTicketPrices();

  const onSubmit = async () => {
    const errors: string[] = [];

    if (!isNameValid && formData.name.trim()) {
      errors.push('• Введите корректное ФИО (минимум 2 символа)');
    }
    if (!isPhoneValid && formData.phone.trim()) {
      errors.push('• Введите корректный номер телефона');
    }
    if (!isEmailValid && formData.email.trim()) {
      errors.push('• Введите корректный email (например: name@example.com)');
    }

    if (errors.length > 0) {
      setAlertMessage(errors.join('\n'));
      setAlertVisible(true);
      return;
    }

    const result = await handleSubmit();
    if (result?.error) {
      setAlertMessage(result.error);
      setAlertVisible(true);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header 
        title="Покупка билета" 
        marginTop={normalize(48)}
        onPress={() => router.push('/(tabs)')}
      />

      <DateWarning />

      <PersonalDataForm
        formData={formData}
        setFormData={setFormData}
        guestCounts={guestCounts}
        setGuestCounts={setGuestCounts}
        onNameValidityChange={setIsNameValid}
        onPhoneValidityChange={setIsPhoneValid}
        onEmailValidityChange={setIsEmailValid}
      />

      <View style={styles.priceCalculationContainer}>
        <Image 
          source={require('@/assets/images/pattern.webp')} 
          style={styles.patternImage} 
        />
        <PriceCalculation 
          youngChildrenCount={guestCounts.onetofour}
          olderChildrenCount={guestCounts.fivetosixteen}
          prices={prices}
        />
      </View>

      <AgreementsBlock
        agreements={agreements}
        setAgreements={setAgreements}
      />

      <View style={styles.buttonContainer}>
        <Btn
          title="Подтвердить"
          onPress={onSubmit}
          width="full"
          bgColor={Colors.green}
          textColor={Colors.black}
        />
        <View style={styles.discountButtonContainer}>
          <TextButton
            title="Почему не прошла скидка?"
            onPress={() => setDiscountModalVisible(true)}
            color={Colors.black}
          />
        </View>
      </View>

      <Alert
        visible={alertVisible}
        title="Ошибка!"
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />

      <DiscountsModal
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
  priceCalculationContainer: {
    marginBottom: normalize(40),
    borderRadius: normalize(25),
    backgroundColor: Colors.grayBg,
    paddingHorizontal: normalize(16),
    paddingVertical: normalize(28),
    marginHorizontal: normalize(16),
    overflow: 'hidden'
  },
  patternImage: {
    width: "110%",
    height: "200%",
    position: 'absolute',
    top: 0,
    left: 0,
    tintColor: 'rgba(0, 0, 0, 0.1)'
  },
  buttonContainer: {
    marginHorizontal: normalize(16)
  },
  discountButtonContainer: {
    paddingBottom: normalize(40),
    marginTop: normalize(10)
  }
});

export default BuyTicket;