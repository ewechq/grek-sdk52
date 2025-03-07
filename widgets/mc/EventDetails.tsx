/**
 * Основной виджет страницы мастер-класса /mc/[id]
 * 
 * Отображает полную информацию о мастер-классе:
 * - Обложка с возрастным ограничением
 * - Заголовок
 * - Длительность
 * - Стоимость
 * - Описание
 * 
 * Использует:
 * - EventCover для отображения обложки
 * - useEventDetails для получения данных
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import { Event } from '@/types/mc';
import { EventCover } from '@/components/pages/mc/EventCover';
import Btn from '@/components/btns/Btn';

interface EventDetailsProps {
  event: Event;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  return (
    <ScrollView style={styles.scrollView} bounces={false}>
      <EventCover cover={event.cover} ageLimit={event.age_limit} />
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{event.title}</Text>
        
        <View style={styles.durationContainer}>
          <Text style={styles.duration}>30 минут</Text>
        </View>

        <Btn 
          title={`${Number(event.price).toFixed(0)} руб/чел`}
          width="full"
          onPress={() => {}}
        />
        
        {event.description && (
          <Text style={styles.description}>
            {event.description}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  contentContainer: {},
  title: {
    ...TextStyles.h2,
    alignSelf: 'center',
  },
  durationContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  duration: {
    ...TextStyles.textDescription,
    alignSelf: 'center',
  },
  description: {
    ...TextStyles.text,
    color: Colors.black,
    marginBottom: 32,
    paddingBottom: 180,
  },
}); 