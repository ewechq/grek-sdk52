import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { NewsItem } from '@/types/news';
import PromoSlider from '@/components/pages/news/PromoSlider';

interface NewsSliderSectionProps {
  news: NewsItem[];
  parentScrollRef?: React.RefObject<ScrollView>;
}

const NewsSliderSection: React.FC<NewsSliderSectionProps> = ({ news, parentScrollRef }) => {
  if (!news?.length) return null;

  return (
    <PromoSlider news={news} parentScrollRef={parentScrollRef} />
  );
};

export default NewsSliderSection; 