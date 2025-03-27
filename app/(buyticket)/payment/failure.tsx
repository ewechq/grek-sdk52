import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '@/theme';
import { FailureWidget } from '@/widgets/buyticket/payment/FailureWidget';

const FailureScreen = () => {
  return (
    <View style={styles.container}>
      <FailureWidget />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default FailureScreen; 