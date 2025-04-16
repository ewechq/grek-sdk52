/**
 * Виджет отображения ошибки оплаты
 * 
 * Функциональность:
 * 1. Отображение сообщения об ошибке
 * 2. Визуализация ошибки через изображение
 * 3. Навигация назад в главное меню
 * 
 * Особенности:
 * - Юмористическое сообщение об ошибке
 * - Адаптивный дизайн
 * - Центрированное расположение элементов
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, TextStyles } from '@/theme';
import Btn from '@/components/ui/btns/Btn';

export const FailureWidget = () => {
  const router = useRouter();

  /**
   * Обработчик нажатия кнопки "Назад"
   * Перенаправляет пользователя в главное меню
   */
  const handleBackPress = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
      {/* Изображение ошибки */}
      <Image source={require('@/assets/images/error.webp')} style={styles.image} />
      
      {/* Заголовок с сообщением об ошибке */}
      <Text style={styles.title}>Грек запутался в проводах и случайно сбил оплату…</Text>
      
      {/* Дополнительное сообщение */}
      <Text style={styles.message}>Давай попробуем еще раз, но без его помощи! 🔌🦕</Text>
      
      {/* Контейнер с кнопкой */}
      <View style={styles.buttonContainer}>
        <Btn 
          title="Назад"
          onPress={handleBackPress}
        />
      </View>
    </View>
  );
};

// Стили компонента
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
  },
  title: {
    ...TextStyles.h2,
    color: Colors.black,
    marginBottom: 4,
    marginHorizontal: 16,
    textAlign: 'center',
  },
  message: {
    ...TextStyles.text,
    color: Colors.black,
    marginBottom: 32,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  buttonContainer: {
    width: '100%',
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 16,
  }
}); 