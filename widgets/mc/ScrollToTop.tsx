/**
 * Виджет кнопки прокрутки к началу списка
 * 
 * Функциональность:
 * 1. Отображение кнопки прокрутки вверх
 * 2. Условное отображение (только когда visible=true)
 * 3. Обработка нажатия для прокрутки
 * 
 * Особенности:
 * - Фиксированное позиционирование
 * - Круглая форма кнопки
 * - Использование иконки из Ionicons
 * - Анимация при нажатии (через TouchableOpacity)
 */

import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme';

/**
 * Пропсы компонента кнопки прокрутки
 */
interface ScrollToTopProps {
  visible: boolean;         // Флаг видимости кнопки
  onPress: () => void;     // Обработчик нажатия
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  visible,
  onPress,
}) => {
  // Если кнопка не должна быть видна, не рендерим ничего
  if (!visible) return null;

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={onPress}
    >
      {/* Иконка стрелки вверх */}
      <Ionicons 
        name="arrow-up" 
        size={24} 
        color={Colors.white}
      />
    </TouchableOpacity>
  );
};

// Стили компонента
const styles = StyleSheet.create({
  button: {
    position: 'absolute',   // Фиксированное позиционирование
    bottom: 80,            // Отступ от нижнего края
    right: 16,             // Отступ от правого края
    width: 50,             // Размеры кнопки
    height: 50,
    borderRadius: 25,      // Круглая форма
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 