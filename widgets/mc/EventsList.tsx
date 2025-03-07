import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import { Event } from '@/types/mc';
import { formatDate, formatTime } from '@/utils/mc/dateFormatters';
import { groupEventsByDate } from '@/utils/mc/eventHelpers';
import CardComponent from '@/components/cards/CardComponent';

interface EventsListProps {
  events: Event[];
  visibleDates: Date[];
  isLoadingMore: boolean;
  selectedDate: Date;
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  visibleDates,
  isLoadingMore,
  selectedDate,
}) => {
  const filteredEvents = useMemo(() => {
    return visibleDates.map(date => ({
      date,
      events: groupEventsByDate(events, date),
    })).filter(({ events }) => events.length > 0);
  }, [events, visibleDates]);

  return (
    <View style={styles.container}>
      <View style={styles.containerWhite}>
      {filteredEvents.map(({ date, events: dateEvents }) => (
        <View key={date.toISOString()} style={styles.dateEventsContainer}>
          <Text style={styles.dateHeader}>
            {formatDate(date)}
          </Text>
          <View style={styles.eventsContainer}>
            {dateEvents.map((event) => (
              <View key={event.id} style={styles.cardWrapper}>
                <CardComponent
                  id={event.id}
                  title={event.title}
                  description={event.description || "Описание отсутствует"}
                  cover={
                    event.cover
                      ? { uri: event.cover }
                      : require("@/assets/images/placeholder2.png")
                  }
                  time={formatTime(event.date_start)}
                  price={event.price ? parseFloat(event.price) : undefined}
                  ageLimit={event.age_limit}
                />
              </View>
            ))}
          </View>
        </View>
      ))}

      {isLoadingMore && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.purple} />
        </View>
      )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.purple,
    
  },
  containerWhite: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: Colors.white,
    paddingBottom: 100,
    
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
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 