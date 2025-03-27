import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Colors } from '@/theme';
import Header from '@/components/ui/layout/Header';
import { Alert } from '@/components/ui/modals/Alert';
import { DiscountsModal } from '@/components/ui/modals/DiscountsModal';
import { useTicketPrices } from '@/hooks/buyticket/useTicketPrices';
import { PriceCalculation } from '@/widgets/buyticket/PriceCalculation';
import { normalize } from '@/utils/responsive';
import { DateWarning } from '@/components/pages/buyticket/DateWarning';
import { PersonalDataForm } from '@/widgets/buyticket/PersonalDataForm';
import { AgreementsBlock } from '@/widgets/buyticket/AgreementsBlock';
import { useBuyTicketForm } from '@/hooks/buyticket/useBuyTicketForm';
import { useBuyTicketValidation } from '@/hooks/buyticket/useBuyTicketValidation';
import { useRouter } from 'expo-router';
import Btn from '@/components/ui/btns/Btn';


const BuyTicket = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [DiscountModalVisible, setDiscountModalVisible] = useState(false);
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

  const {
    setIsNameValid,
    setIsPhoneValid,
    setIsEmailValid,
    validateForm
  } = useBuyTicketValidation();

  const { prices, isLoading } = useTicketPrices();

  const onSubmit = async () => {
    const errors = validateForm(formData);

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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
            attendantCount={guestCounts.attendant}
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
    </TouchableWithoutFeedback>
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
    marginHorizontal: normalize(16),
    marginBottom: 100
  },
  discountButtonContainer: {
    paddingBottom: normalize(40),
    marginTop: normalize(10)
  }
});

export default BuyTicket;