import { normalizeFontSize } from '@/utils/responsive';

// Базовые настройки
const BASE_FONT_SIZE = 16;
const FONT_FAMILY = 'VelaSans';

// Доступные толщины
export type FontWeight = 'Light' | 'Regular' | 'Medium' | 'SemiBold' | 'Bold';

// Функция для создания шрифта
const createFont = (weight: FontWeight) => `${FONT_FAMILY}-${weight}`;

// Основная функция типографики - размер в px, толщина, коэффициент высоты строки
export const typography = (
  size: number, 
  weight: FontWeight = 'Regular', 
  lineHeightMultiplier: number = 1.2
) => ({
  fontSize: normalizeFontSize(size, size >= 16), // заголовки >= 16px получают особую нормализацию
  fontFamily: createFont(weight),
  lineHeight: normalizeFontSize(size * lineHeightMultiplier, size >= 16),
});

// Готовые стили для быстрого использования
export const Typography = {
  // Заголовки
  h1: (weight: FontWeight = 'SemiBold') => typography(18, weight, 1.2),
  h2: (weight: FontWeight = 'SemiBold') => typography(16, weight, 1.2), 
  h3: (weight: FontWeight = 'Regular') => typography(14, weight, 1.3),
  h4: (weight: FontWeight = 'Medium') => typography(12, weight, 1.3),
  
  // Текст
  body: (weight: FontWeight = 'Regular') => typography(16, weight, 1.4),
  caption: (weight: FontWeight = 'Regular') => typography(14, weight, 1.2),
  small: (weight: FontWeight = 'Regular') => typography(12, weight, 1.0),
  
  // Кастомные размеры
  custom: typography,
}; 