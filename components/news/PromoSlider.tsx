import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  FlatList,
  TouchableOpacity,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  AppState,
} from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/theme';
import { NewsItem } from '@/types/news';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const PADDING_HORIZONTAL = 16;
const PADDING_VERTICAL = 32;
const CONTAINER_SIZE = width - (PADDING_HORIZONTAL * 2);
const AUTOPLAY_DELAY = 3000;
const MAX_SLIDES = 6;
const IS_ANDROID = Platform.OS === 'android';

interface PromoSliderProps {
  news: NewsItem[];
  parentScrollRef?: React.RefObject<ScrollView>;
}

interface ExtendedNewsItem extends NewsItem {
  uniqueId: string;
}

const PromoSlider: React.FC<PromoSliderProps> = React.memo(({ news, parentScrollRef }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout>();
  
  const { originalNews, limitedNews, startIndex, totalLength } = useMemo(() => {
    const original = news.slice(0, MAX_SLIDES).map(item => ({
      ...item,
      uniqueId: `original_${item.id}`,
    }));

    return {
      originalNews: original,
      limitedNews: [
        ...original.map(item => ({ ...item, uniqueId: `prev_${item.id}` })),
        ...original.map(item => ({ ...item, uniqueId: `current_${item.id}` })),
        ...original.map(item => ({ ...item, uniqueId: `next_${item.id}` })),
      ],
      startIndex: original.length,
      totalLength: original.length * 3
    };
  }, [news]);

  const startAutoplay = useCallback(() => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }

    if (!IS_ANDROID && isVisible && !isDragging && originalNews.length > 1) {
      autoplayTimerRef.current = setInterval(() => {
        if (flatListRef.current) {
          const nextIndex = (activeIndex + 1) % originalNews.length;
          const scrollToIndex = startIndex + nextIndex;
          
          flatListRef.current.scrollToIndex({
            index: scrollToIndex,
            animated: true
          });
        }
      }, AUTOPLAY_DELAY);
    }
  }, [activeIndex, isDragging, originalNews.length, startIndex, isVisible]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setIsVisible(nextAppState === 'active');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: startIndex,
      animated: false
    });
    setActiveIndex(0);
  }, [startIndex]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [startAutoplay]);

  const handlePress = useCallback((id: number) => {
    router.push(`/(tabs)/news/${id}`);
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffset / CONTAINER_SIZE);

    if (currentIndex <= originalNews.length - 1) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + originalNews.length,
          animated: false
        });
      });
    } else if (currentIndex >= totalLength - originalNews.length) {
      requestAnimationFrame(() => {
        flatListRef.current?.scrollToIndex({
          index: currentIndex - originalNews.length,
          animated: false
        });
      });
    }
  }, [originalNews.length, totalLength]);

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      const newIndex = viewableItems[0].index % originalNews.length;
      requestAnimationFrame(() => {
        setActiveIndex(newIndex);
      });
    }
  }, [originalNews.length]);

  const handleScrollBeginDrag = useCallback(() => {
    setIsDragging(true);
    if (parentScrollRef?.current) {
      parentScrollRef.current.setNativeProps({ scrollEnabled: false });
    }
  }, [parentScrollRef]);

  const handleScrollEndDrag = useCallback(() => {
    setIsDragging(false);
    if (parentScrollRef?.current) {
      parentScrollRef.current.setNativeProps({ scrollEnabled: true });
    }
    // Перезапускаем автоплей после окончания перетаскивания
    startAutoplay();
  }, [parentScrollRef, startAutoplay]);

  const renderItem = useCallback(({ item }: { item: ExtendedNewsItem }) => (
    <TouchableOpacity
      style={styles.slideContainer}
      onPress={() => handlePress(item.id)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: item.cover }}
        style={styles.image}
        contentFit="cover"
        transition={IS_ANDROID ? 0 : 200}
        cachePolicy="memory-disk"
        priority={IS_ANDROID ? "high" : "normal"}
      />
    </TouchableOpacity>
  ), [handlePress]);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: CONTAINER_SIZE,
    offset: CONTAINER_SIZE * index,
    index,
  }), []);

  const keyExtractor = useCallback((item: ExtendedNewsItem) => item.uniqueId, []);

  const renderDot = useCallback((index: number) => (
    <View
      key={`dot_${index}`}
      style={[
        styles.dot,
        { backgroundColor: index === activeIndex ? Colors.purple : Colors.white }
      ]}
    />
  ), [activeIndex]);

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
          getItemLayout={getItemLayout}
          keyExtractor={keyExtractor}
          removeClippedSubviews={true}
          initialNumToRender={3}
          maxToRenderPerBatch={3}
          windowSize={3}
          updateCellsBatchingPeriod={75}
        />
        <View style={styles.pagination}>
          {originalNews.map((_, index) => renderDot(index))}
        </View>
      </View>
    </View>
  );
});

export default PromoSlider;

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