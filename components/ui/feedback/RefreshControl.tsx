/**
 * Кастомный компонент RefreshControl без теней
 * 
 * Используется для стандартизации внешнего вида RefreshControl во всем приложении
 * Удаляет тень и настраивает цвета в соответствии с темой приложения
 */

import React from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';
import { Colors } from '@/theme';

interface CustomRefreshControlProps extends Omit<RefreshControlProps, 'progressBackgroundColor' | 'colors' | 'tintColor'> {
  color?: string; 
}

export const CustomRefreshControl: React.FC<CustomRefreshControlProps> = ({
  refreshing,
  onRefresh,
  color = Colors.white,
  ...restProps
}) => {
  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[color]}
      tintColor={color}
      progressBackgroundColor={Colors.purple}
      {...restProps}
    />
  );
}; 