import React, { useState } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/theme';
import { SmsVerificationWidget } from '@/widgets/buyticket/payment/SmsVerificationWidget';
import { Ionicons } from '@expo/vector-icons';

const ConfirmNumberPage = () => {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [signatureId] = useState(() => {
    const id = Number(params.signatureId);
    if (isNaN(id)) {
      throw new Error('Некорректный ID подписи');
    }
    return id;
  });
  
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back-outline" size={16} color={Colors.grayText} style={{marginTop: 20}}/>
        </TouchableOpacity>
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
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 1,
    padding: 8,
  },
});

export default ConfirmNumberPage; 