import React from 'react';
import { Stack, router } from 'expo-router';
import { StyleSheet, Text, View, Image } from 'react-native';
import Btn from '@/components/ui/btns/Btn';
import { TextStyles, Colors } from '@/theme/index';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Image source={require('@/assets/images/error.webp')} style={styles.image} />
        <Text style={styles.text}>Ой-ой! Грек так долго искал эту страницу, что уснул.</Text>
        <Text style={styles.textDescription}>🦕😴 Но он точно знает, где кнопка «Назад»! </Text>
        <Btn title="Назад" onPress={() => router.push('/(tabs)')} bgColor={Colors.pink} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#fff',
  },
  animation: {
    width: '100%',
    height: 400,
    alignSelf: 'center',
  },
  text: {
    ...TextStyles.h2,
    marginVertical: 10,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  textDescription: {
    ...TextStyles.text,
    marginBottom: 20,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  image:{
    width: 300,
    height: 300,
    alignSelf: 'center',
  }

});
