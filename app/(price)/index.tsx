import HeaderInner from '@/components/ui/layout/Header';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

const Price = () => {
 
  return (
    <View style={{margin:40}}>
      <HeaderInner title='Стоимость билетов'/>
      <Text>Price</Text>
    </View>
  );
};

const styles = StyleSheet.create({
 
});

export default Price;