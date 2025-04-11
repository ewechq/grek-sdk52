/**
 * Кастомный компонент ActivityIndicator 
 * 
 * Используется для стандартизации внешнего вида индикаторов загрузки во всем приложении
 * Соответствует стилю CustomRefreshControl
 */

import React from 'react';
import { ActivityIndicator, View, StyleSheet, ActivityIndicatorProps } from 'react-native';
import { Colors } from '@/theme';

interface CustomActivityIndicatorProps extends Omit<ActivityIndicatorProps, 'color'> {
  color?: string; // Опциональный параметр для переопределения цвета
  containerStyle?: object; // Дополнительные стили для контейнера
}

export const CustomActivityIndicator: React.FC<CustomActivityIndicatorProps> = ({
  size = 'large',
  color = Colors.purple,
  containerStyle,
  ...restProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <ActivityIndicator 
        size={size} 
        color={color}
        {...restProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
}); 