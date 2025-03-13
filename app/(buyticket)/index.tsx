import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Image } from 'react-native';
import { Colors } from '@/theme';
import Btn from '@/components/btns/Btn';
import Header from '@/components/Header';
import TextButton from '@/components/btns/BtnDownlineText';
import { useRouter } from 'expo-router';
import CustomAlert from '@/components/modals/CustomAlert';
import { useTicketPrices } from '@/hooks/useTicketPrices';
import { PriceCalculation } from '@/widgets/tickets/PriceCalculation';
import { normalize } from '@/utils/responsive';
import DiscountModal from '@/components/modals/DiscountsModal';
import { DateWarning } from '@/components/buyticket/DateWarning';
import { PersonalDataForm } from '@/widgets/buyticket/PersonalDataForm';
import { AgreementsBlock } from '@/widgets/buyticket/AgreementsBlock';
import { useBuyTicketForm } from '@/hooks/buyticket/useBuyTicketForm';

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

  const { prices, isLoading } = useTicketPrices();

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
      />

      <View style={styles.priceCalculationContainer}>
        <Image 
          source={require('@/assets/images/pattern.png')} 
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
          onPress={handleSubmit}
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