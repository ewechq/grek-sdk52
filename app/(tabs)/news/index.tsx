import React, { useState, useEffect, memo } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Colors } from '@/theme';
import { PostersSlider } from '@/components/blocks/news/PostersSlider';
import { NewsSection } from '@/components/blocks/news/NewsSection';
import { useArticles } from '@/hooks/useArticles';
import { FontStyles } from '@/theme/fonts';

const slides = [
  require('../../../assets/images/poster1.jpg'),
  require('../../../assets/images/poster2.jpg'),
  require('../../../assets/images/poster3.jpg'),
  require('../../../assets/images/poster4.jpg'),
];

const NewsScreen = memo(() => {
  const { news, blog, isLoading } = useArticles(6);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.purple} />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      removeClippedSubviews={true}
    >
      <PostersSlider slides={slides} />
      <View style={{ paddingBottom: 140 }} >
        <NewsSection 
          title="Новости" 
          data={news}
          onShowAll={() => {/* навигация */}}
        />
        
        <NewsSection 
          title="Блог" 
          data={blog}
          onShowAll={() => {/* навигация */}}
        />
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});

export default NewsScreen;