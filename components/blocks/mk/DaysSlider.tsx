import React, { useEffect, useCallback, memo } from 'react';
import { FlatList, TouchableOpacity, Text, StyleSheet, View, Image } from 'react-native';
import { Colors, TextStyles } from "@/theme";

interface DaysSliderProps {
  days: Date[];
  selectedDate: Date;
  onDayPress: (date: Date) => void;
  flatListRef: React.RefObject<FlatList>;
}

// Оптимизированный компонент для рендера дня
const DayItem = memo(({ 
  item, 
  selectedDate, 
  onPress 
}: { 
  item: Date; 
  selectedDate: Date; 
  onPress: () => void; 
}) => {
  const isSelected = selectedDate.toDateString() === item.toDateString();
  
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.dayContainer,
        isSelected && styles.selectedDayContainer,
      ]}
    >
      <View>            
        <Image 
          source={require('@/assets/images/pattern.png')} 
          resizeMode='cover' 
          style={styles.patternImage}
        />
        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
          {item.getDate()}
        </Text>
      </View>
      <Text style={[styles.weekdayText, isSelected && styles.selectedWeekdayText]}>
        {item.toLocaleDateString("ru-RU", { weekday: "short" })}
      </Text>
    </TouchableOpacity>
  );
});

export const DaysSlider: React.FC<DaysSliderProps> = ({
  days,
  selectedDate,
  onDayPress,
  flatListRef,
}) => {
  const getItemLayout = useCallback((data: any, index: number) => ({
    length: 80,
    offset: 80 * index,
    index,
  }), []);

  const scrollToSelectedDate = useCallback(() => {
    const index = days.findIndex(
      day => day.toDateString() === selectedDate.toDateString()
    );
    
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.6, // центрируем выбранную дату
      });
    }
  }, [selectedDate, days]);

  // Прокручиваем к выбранной дате при изменении selectedDate или days
  useEffect(() => {
    if (days.length > 0) {
      // Добавляем небольшую задержку для корректной прокрутки
      const timer = setTimeout(scrollToSelectedDate, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedDate, days]);

  const handleScrollToIndexFailed = useCallback(() => {
    setTimeout(scrollToSelectedDate, 500);
  }, [scrollToSelectedDate]);

  const renderItem = useCallback(({ item }: { item: Date }) => (
    <DayItem
      item={item}
      selectedDate={selectedDate}
      onPress={() => onDayPress(item)}
    />
  ), [selectedDate, onDayPress]);

  return (
    <FlatList
      ref={flatListRef}
      horizontal
      data={days}
      keyExtractor={(item) => item.toDateString()}
      getItemLayout={getItemLayout}
      onScrollToIndexFailed={handleScrollToIndexFailed}
      renderItem={renderItem}
      contentContainerStyle={styles.flatListContent}
      showsHorizontalScrollIndicator={false}
      snapToAlignment="center"
      decelerationRate="fast"
      initialNumToRender={14}
      maxToRenderPerBatch={14}
      windowSize={14}
      removeClippedSubviews={true}
    />
  );
};

const styles = StyleSheet.create({
  flatListContent: {
    paddingVertical: 8,
  },
  dayContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  selectedDayContainer: {
    backgroundColor: Colors.pink,
  },
  dayText: {
    ...TextStyles.h3Number,
    color: Colors.white,
  },
  selectedDayText: {
    color: Colors.white,
  },
  weekdayText: {
    textAlign: "center",
    ...TextStyles.textDescription,
    color: Colors.white,
  },
  selectedWeekdayText: {
    color: Colors.white,
    ...TextStyles.text,
  },
  patternImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3
  }
}); 