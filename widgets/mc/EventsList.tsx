/**
 * Виджет списка мероприятий
 * 
 * Функциональность:
 * 1. Отображение списка мероприятий по датам
 * 2. Группировка и сортировка мероприятий по времени
 * 3. Обработка повторяющихся мероприятий
 * 4. Поддержка бесконечной прокрутки
 * 
 * Особенности:
 * - Мемоизация для оптимизации производительности
 * - Адаптивная сетка карточек мероприятий
 * - Обработка пустого состояния
 * - Поддержка загрузки дополнительных данных
 */

import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import { Event } from '@/types/mc';
import { formatDate, formatTime } from '@/utils/mc/dateFormatters';
import CardComponent from '@/components/pages/mc/EventsCard';
import { CustomActivityIndicator } from '@/components/ui/feedback/ActivityIndicator';

/**
 * Пропсы компонента списка мероприятий
 */
interface EventsListProps {
  events: Event[];              // Массив мероприятий
  visibleDates: Date[];        // Видимые даты в календаре
  isLoadingMore: boolean;      // Флаг загрузки дополнительных данных
  selectedDate: Date;          // Выбранная дата
  onEmpty?: () => React.ReactNode; // Рендер-функция для пустого состояния
}

/**
 * Проверяет, происходит ли мероприятие в указанную дату
 * Учитывает правила повторения мероприятий
 */
const isEventOnDate = (event: Event, targetDate: Date): boolean => {
  const eventDate = new Date(event.date_start);
  
  // Если нет параметров повторения, проверяем только точное совпадение даты
  if (!event.repeat_days && !event.repeat_end_date) {
    return (
      eventDate.getDate() === targetDate.getDate() &&
      eventDate.getMonth() === targetDate.getMonth() &&
      eventDate.getFullYear() === targetDate.getFullYear()
    );
  }

  // Проверяем, не вышла ли дата за пределы периода повторения
  if (event.repeat_end_date) {
    const endDate = new Date(event.repeat_end_date);
    if (targetDate > endDate) return false;
  }

  // Проверяем, входит ли день недели в список повторяющихся дней
  if (event.repeat_days) {
    const repeatDays = event.repeat_days.split(',').map(Number);
    const targetDay = targetDate.getDay();
    return repeatDays.includes(targetDay);
  }

  return false;
};

/**
 * Получает время начала мероприятия в формате HH:mm
 */
const getEventTime = (event: Event): string => {
  const date = new Date(event.date_start);
  return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
};

/**
 * Группирует и сортирует мероприятия по времени начала
 */
const groupAndSortEvents = (events: Event[]): Event[] => {
  // Группируем события по времени
  const eventsByTime = events.reduce((acc, event) => {
    const time = getEventTime(event);
    if (!acc[time]) {
      acc[time] = [];
    }
    acc[time].push(event);
    return acc;
  }, {} as { [key: string]: Event[] });

  // Сортируем времена
  const sortedTimes = Object.keys(eventsByTime).sort();

  // Собираем отсортированный список событий
  return sortedTimes.flatMap(time => eventsByTime[time]);
};

export const EventsList: React.FC<EventsListProps> = ({
  events,
  visibleDates,
  isLoadingMore,
  selectedDate,
  onEmpty,
}) => {
  // Проверяем наличие видимых мероприятий
  const hasVisibleEvents = useMemo(() => {
    return visibleDates.some(date => {
      const dateEvents = events.filter(event => isEventOnDate(event, date));
      return dateEvents.length > 0;
    });
  }, [events, visibleDates]);

  return (
    <View style={styles.container}>
      <View style={styles.containerWhite}>
        {/* Отображаем пустое состояние или список мероприятий */}
        {!hasVisibleEvents && onEmpty ? (
          onEmpty()
        ) : (
          <View style={styles.content}>
            {/* Отображаем мероприятия по датам */}
            {visibleDates.map(date => {
              const dateEvents = groupAndSortEvents(
                events.filter(event => isEventOnDate(event, date))
              );

              if (dateEvents.length === 0) return null;

              return (
                <View key={date.toISOString()} style={styles.dateEventsContainer}>
                  {/* Заголовок с датой */}
                  <Text style={styles.dateHeader}>
                    {formatDate(date)}
                  </Text>
                  {/* Сетка карточек мероприятий */}
                  <View style={styles.eventsContainer}>
                    {dateEvents.map((event) => (
                      <View key={`${event.id}-${event.date_start}`} style={styles.cardWrapper}>
                        <CardComponent
                          id={event.id}
                          title={event.title || ''}
                          cover={
                            event.cover
                              ? { uri: event.cover }
                              : require("@/assets/images/placeholder.webp")
                          }
                          time={event.date_start ? formatTime(event.date_start) : undefined}
                          price={event.price ? parseFloat(event.price) : undefined}
                          ageLimit={event.age_limit || undefined}
                        />
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Индикатор загрузки дополнительных данных */}
        {isLoadingMore && (
          <CustomActivityIndicator containerStyle={styles.loaderContainer} />
        )}
      </View>
    </View>
  );
};

// Стили компонента
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.purple,
  },
  containerWhite: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
  },
  dateEventsContainer: {
    marginTop: 44,
  },
  dateHeader: {
    ...TextStyles.h2,
    color: Colors.black,
    marginBottom: 8,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  eventsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 20,
  },
  loaderContainer: {
    paddingTop: 20,
    paddingBottom: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 