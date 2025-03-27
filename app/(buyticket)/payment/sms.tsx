import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/theme';
import { SmsVerificationWidget } from '@/widgets/buyticket/payment/SmsVerificationWidget';

const ConfirmNumberPage = () => {
  const params = useLocalSearchParams();
  const [signatureId, setSignatureId] = useState(Number(params.signatureId));
  let ticketData = null;
  
  try {
    if (params.ticketData) {
      ticketData = JSON.parse(params.ticketData as string);
    }
  } catch (error) {
    console.error('Ошибка при парсинге ticketData:', error);
  }

  if (!ticketData || !signatureId) {
    return null;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <SmsVerificationWidget signatureId={signatureId} ticketData={ticketData} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default ConfirmNumberPage; 