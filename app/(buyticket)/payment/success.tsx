import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/theme';
import { SuccessWidget } from '@/widgets/buyticket/payment/SuccessWidget';

const SuccessScreen = () => {
  return (
    <View style={styles.container}>
      <SuccessWidget />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default SuccessScreen; 