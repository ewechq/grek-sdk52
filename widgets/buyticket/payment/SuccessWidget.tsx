/**
 * Виджет успешной оплаты
 * 
 * Функциональность:
 * 1. Отображение сообщения об успешной оплате
 * 2. Визуализация успеха через изображение
 * 3. Навигация назад в главное меню
 * 
 * Особенности:
 * - Позитивное сообщение об успехе
 * - Адаптивный дизайн
 * - Центрированное расположение элементов
 * - Кастомный цвет кнопки
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Typography } from '@/theme';
import Btn from '@/components/ui/btns/Btn';

export const SuccessWidget = () => {
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
      {/* Изображение успеха */}
      <Image source={require('@/assets/images/success.webp')} style={styles.image} />
      
      {/* Контейнер с текстом и кнопкой */}
      <View style={styles.containerText}>
        {/* Заголовок с сообщением об успехе */}
        <Text style={styles.title}>Билеты летят к вам на почту! </Text>
        
        {/* Дополнительное сообщение */}
        <Text style={styles.message}>А Грек уже ждет на входе! 🦖🚀 Добро пожаловать в мир веселья!</Text>
        
        {/* Контейнер с кнопкой */}
        <View style={styles.buttonContainer}>
          <Btn 
            title="Назад"
            onPress={handleBackPress}
            bgColor={Colors.pink}
          />
        </View>
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
  },
  containerText: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    ...Typography.h2(),
    color: Colors.black,
    marginBottom: 4,
    textAlign: 'center',
  },
  message: {
    ...Typography.caption(),
    color: Colors.black,
    marginBottom: 32,
    textAlign: 'center',
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