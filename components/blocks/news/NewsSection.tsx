import React, { memo, useCallback, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import NewsCard from '@/components/cards/NewsCard';
import { Article } from '@/types/articles';
import { Ionicons } from '@expo/vector-icons';
import { normalize } from '@/utils/responsive';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.5;
const CARD_MARGIN = 4;

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

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: CARD_WIDTH,
    offset: (CARD_WIDTH + CARD_MARGIN) * index,
    index,
  }), []);

  const memoizedData = useMemo(() => data, [data]);

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.titleContainer} 
        onPress={onShowAll}
        disabled={!onShowAll}
      >
        <Text style={styles.title}>{title}</Text>
        {onShowAll && (
          <Ionicons 
            name="chevron-forward" 
            size={normalize(16)} 
            color={Colors.grayText} 
          />
        )}
      </TouchableOpacity>
      
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={memoizedData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.slider}
        snapToInterval={CARD_WIDTH + CARD_MARGIN}
        decelerationRate="fast"
        removeClippedSubviews={true}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        windowSize={3}
        updateCellsBatchingPeriod={75}
        getItemLayout={getItemLayout}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10,
        }}
      />
    </View>
  );
}, (prevProps, nextProps) => {
  if (prevProps.title !== nextProps.title) return false;
  if (prevProps.data.length !== nextProps.data.length) return false;
  return prevProps.data.every((item, index) => item.id === nextProps.data[index].id);
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
    width: CARD_WIDTH,
    paddingRight: CARD_MARGIN,
  },
  slider: {
    paddingHorizontal: 12,
  },
}); 