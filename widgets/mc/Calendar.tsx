/**
 * Виджет горизонтального календаря
 * 
 * Функциональность:
 * 1. Отображение дней в горизонтальном списке
 * 2. Автоматическая прокрутка к выбранной дате
 * 3. Отображение текущего месяца
 * 4. Выделение выбранной даты
 * 
 * Особенности:
 * - Оптимизация производительности через useCallback
 * - Плавная анимация прокрутки
 * - Центрирование выбранной даты
 * - Переиспользуемые компоненты для дней и заголовка
 */

import React, { useCallback, useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { CalendarHeader } from '@/components/pages/mc/CalendarHeader';
import { DayItem } from '@/components/pages/mc/DayItem';
import { generateDays, formatMonthName } from '@/utils/mc/dateUtils';

// Получаем ширину экрана для расчета прокрутки
const { width: SCREEN_WIDTH } = Dimensions.get('window');

/**
 * Пропсы компонента календаря
 */
interface CalendarProps {
  selectedDate: Date;         // Выбранная дата
  onDateSelect: (date: Date) => void; // Обработчик выбора даты
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  // Реф для доступа к FlatList
  const flatListRef = useRef<FlatList>(null);
  
  // Получаем название месяца и массив дат
  const monthName = formatMonthName(selectedDate);
  const days = generateDays(selectedDate);

  /**
   * Прокручивает список к выбранной дате
   * Центрирует выбранную дату на экране
   */
  const scrollToSelectedDate = useCallback(() => {
    if (flatListRef.current) {
      const dayWidth = 60; // Примерная ширина элемента дня
      const screenCenter = SCREEN_WIDTH / 2;
      const selectedIndex = days.findIndex(
        date => date.toDateString() === selectedDate.toDateString()
      );
      
      if (selectedIndex !== -1) {
        const scrollPosition = (selectedIndex * dayWidth) - (screenCenter - dayWidth / 2);
        flatListRef.current.scrollToOffset({
          offset: Math.max(0, scrollPosition),
          animated: true
        });
      }
    }
  }, [selectedDate, days]);

  // Прокручиваем к выбранной дате при изменении даты
  useEffect(() => {
    scrollToSelectedDate();
  }, [selectedDate, scrollToSelectedDate]);

  /**
   * Рендер элемента дня
   * Мемоизирован для оптимизации производительности
   */
  const renderItem = useCallback(({ item }: { item: Date }) => (
    <DayItem
      date={item}
      isSelected={selectedDate.toDateString() === item.toDateString()}
      onPress={onDateSelect}
    />
  ), [selectedDate, onDateSelect]);

  return (
    <View style={styles.container}>
      {/* Заголовок календаря с названием месяца */}
      <CalendarHeader
        monthName={monthName}
      />

      {/* Контейнер со списком дней */}
      <View style={styles.daysContainer}>
        <FlatList
          ref={flatListRef}
          horizontal
          data={days}
          keyExtractor={(item) => item.toDateString()}
          renderItem={renderItem}
          contentContainerStyle={styles.flatListContent}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  daysContainer: {
    marginTop: 16,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
}); 