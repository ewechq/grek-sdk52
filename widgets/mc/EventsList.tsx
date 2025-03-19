import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import { Event } from '@/types/mc';
import { formatDate, formatTime } from '@/utils/mc/dateFormatters';
import CardComponent from '@/components/pages/mc/EventsCard';

interface EventsListProps {
  events: Event[];
  visibleDates: Date[];
  isLoadingMore: boolean;
  selectedDate: Date;
  onEmpty?: () => React.ReactNode;
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  visibleDates,
  isLoadingMore,
  selectedDate,
  onEmpty,
}) => {
  const hasVisibleEvents = useMemo(() => {
    return visibleDates.some(date => {
      const dateEvents = events.filter(event => {
        const eventDate = new Date(event.date_start);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      });
      return dateEvents.length > 0;
    });
  }, [events, visibleDates]);

  return (
    <View style={styles.container}>
      <View style={styles.containerWhite}>
        {!hasVisibleEvents && onEmpty ? (
          onEmpty()
        ) : (
          <View style={styles.content}>
            {visibleDates.map(date => {
              const dateEvents = events.filter(event => {
                const eventDate = new Date(event.date_start);
                return (
                  eventDate.getDate() === date.getDate() &&
                  eventDate.getMonth() === date.getMonth() &&
                  eventDate.getFullYear() === date.getFullYear()
                );
              });

              if (dateEvents.length === 0) return null;

              return (
                <View key={date.toISOString()} style={styles.dateEventsContainer}>
                  <Text style={styles.dateHeader}>
                    {formatDate(date)}
                  </Text>
                  <View style={styles.eventsContainer}>
                    {dateEvents.map((event) => (
                      <View key={event.id} style={styles.cardWrapper}>
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
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    paddingBottom: 160,
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