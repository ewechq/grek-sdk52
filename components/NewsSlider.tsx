import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';
import { Colors } from '@/theme';
import { NewsItem } from '@/types/news';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 16;
const PADDING_VERTICAL = 32;
const CONTAINER_SIZE = width - (PADDING_HORIZONTAL * 2);
const AUTOPLAY_DELAY = 3000;
const MAX_SLIDES = 6;

interface NewsSliderProps {
  news: NewsItem[];
  parentScrollRef?: React.RefObject<ScrollView>;
}

interface ExtendedNewsItem extends NewsItem {
  uniqueId: string;
}

export const NewsSlider: React.FC<NewsSliderProps> = ({ news, parentScrollRef }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const originalNews = news.slice(0, MAX_SLIDES).map(item => ({
    ...item,
    uniqueId: `original_${item.id}`,
  }));

  const limitedNews = [
    ...originalNews.map(item => ({ ...item, uniqueId: `prev_${item.id}` })),
    ...originalNews.map(item => ({ ...item, uniqueId: `current_${item.id}` })),
    ...originalNews.map(item => ({ ...item, uniqueId: `next_${item.id}` })),
  ];

  const startIndex = originalNews.length;
  const totalLength = limitedNews.length;

  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: startIndex,
      animated: false
    });
    setActiveIndex(0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (flatListRef.current && !isDragging) {
        const nextIndex = (activeIndex + 1) % originalNews.length;
        const scrollToIndex = startIndex + nextIndex;
        flatListRef.current.scrollToIndex({
          index: scrollToIndex,
          animated: true
        });
      }
    }, AUTOPLAY_DELAY);

    return () => clearInterval(timer);
  }, [activeIndex, isDragging]);

  const handlePress = (id: number) => {
    router.push(`/(tabs)/news/${id}`);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffset / CONTAINER_SIZE);

    if (currentIndex <= originalNews.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + originalNews.length,
        animated: false
      });
    } else if (currentIndex >= totalLength - originalNews.length) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - originalNews.length,
        animated: false
      });
    }
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      const newIndex = viewableItems[0].index % originalNews.length;
      setActiveIndex(newIndex);
    }
  }).current;

  const handleScrollBeginDrag = () => {
    setIsDragging(true);
    if (parentScrollRef?.current) {
      parentScrollRef.current.setNativeProps({ scrollEnabled: false });
    }
  };

  const handleScrollEndDrag = () => {
    setIsDragging(false);
    if (parentScrollRef?.current) {
      parentScrollRef.current.setNativeProps({ scrollEnabled: true });
    }
  };

  const renderItem = ({ item }: { item: ExtendedNewsItem }) => (
    <TouchableOpacity
      style={styles.slideContainer}
      onPress={() => handlePress(item.id)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.cover }}
        style={styles.image}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderDot = (index: number) => (
    <View
      key={`dot_${index}`}
      style={[
        styles.dot,
        { backgroundColor: index === activeIndex ? Colors.purple : Colors.white }
      ]}
    />
  );

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <FlatList
          ref={flatListRef}
          data={limitedNews}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          onScroll={handleScroll}
          onScrollBeginDrag={handleScrollBeginDrag}
          onScrollEndDrag={handleScrollEndDrag}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50
          }}
          getItemLayout={(_, index) => ({
            length: CONTAINER_SIZE,
            offset: CONTAINER_SIZE * index,
            index,
          })}
          keyExtractor={item => item.uniqueId}
        />
        <View style={styles.pagination}>
          {originalNews.map((_, index) => renderDot(index))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: PADDING_VERTICAL,
    backgroundColor: Colors.white,
  },
  container: {
    height: CONTAINER_SIZE,
    width: CONTAINER_SIZE,
    backgroundColor: Colors.white,
    borderRadius: 25,
    overflow: 'hidden',
  },
  slideContainer: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  dot: {
    width: 20,
    height: 4,
    borderRadius: 4,
    marginHorizontal: 2,
  },
}); 