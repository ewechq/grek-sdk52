/**
 * Виджет слайдера промо-новостей
 * 
 * Функциональность:
 * 1. Отображение слайдера с промо-новостями
 * 2. Интеграция с родительским ScrollView
 * 3. Обработка пустого состояния
 * 
 * Особенности:
 * - Условный рендеринг
 * - Передача ссылки на родительский ScrollView
 * - Простой и легковесный компонент
 */

import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { NewsItem } from '@/types/news';
import PromoSlider from '@/components/pages/news/PromoSlider';

/**
 * Пропсы компонента слайдера
 */
interface NewsSliderSectionProps {
  news: NewsItem[];                    // Массив промо-новостей
  parentScrollRef?: React.RefObject<ScrollView>; // Ссылка на родительский ScrollView
}

const NewsSliderSection: React.FC<NewsSliderSectionProps> = ({ news, parentScrollRef }) => {
  // Если нет новостей, не рендерим компонент
  if (!news?.length) return null;

  return (
    <PromoSlider news={news} parentScrollRef={parentScrollRef} />
  );
};

export default NewsSliderSection; 