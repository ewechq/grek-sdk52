import React from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import NewsCard from '@/components/cards/NewsCard';
import { Article } from '@/types/articles';

const { width } = Dimensions.get('window');

interface NewsSectionProps {
  title: string;
  data: Article[];
  onShowAll?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ 
  title, 
  data,
  onShowAll 
}) => (
  <View style={styles.container}>
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text 
        style={styles.showAll}
        onPress={onShowAll}
      >
        Показать все
      </Text>
    </View>
    
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      renderItem={({ item }) => (
        <View style={styles.cardWrapper}>
          <NewsCard
            id={item.id}
            title={item.title}
            introtext={item.introtext}
            site_cover={item.site_cover}
          />
        </View>
      )}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.slider}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    ...TextStyles.h2,
    color: Colors.black,
  },
  showAll: {
    ...TextStyles.text,
    color: Colors.grayText,
  },
  cardWrapper: {
    width: width * 0.5,
    marginRight: 4,
  },
  slider: {
    paddingHorizontal: 16,
  },
}); 