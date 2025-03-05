import React, { memo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import NewsCard from '@/components/cards/NewsCard';
import { Article } from '@/types/articles';
import { Ionicons } from '@expo/vector-icons';
import { normalize } from '@/utils/responsive';
const { width } = Dimensions.get('window');

interface NewsSectionProps {
  title: string;
  data: Article[];
  onShowAll?: () => void;
}

export const NewsSection: React.FC<NewsSectionProps> = memo(({ 
  title, 
  data,
  onShowAll 
}) => {
  const renderItem = useCallback(({ item }: { item: Article }) => (
    <View style={styles.cardWrapper}>
      <NewsCard
        id={item.id}
        title={item.title}
        introtext={item.introtext}
        cover={item.cover}
      />
    </View>
  ), []);

  const keyExtractor = useCallback((item: Article) => item.id.toString(), []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.titleContainer} onPress={onShowAll}>
        <Text style={styles.title}>{title}</Text>
        <Ionicons name="chevron-forward" size={normalize(16)} color={Colors.grayText} />
      </TouchableOpacity>
      
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.slider}
        snapToInterval={width * 0.5 + 4}
        decelerationRate="fast"
        removeClippedSubviews={true}
        initialNumToRender={2}
        maxToRenderPerBatch={3}
        windowSize={5}
        updateCellsBatchingPeriod={30}
        getItemLayout={(data, index) => ({
          length: width * 0.5,
          offset: (width * 0.5 + 4) * index,
          index,
        })}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingTop: 16,
    paddingBottom: 16,
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
    paddingRight: 8,
  },
  slider: {
    paddingHorizontal: 12,
  },
}); 