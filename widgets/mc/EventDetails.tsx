/**
 * Виджет детальной информации о мероприятии
 * 
 * Функциональность:
 * 1. Отображение подробной информации о мероприятии
 * 2. Отображение обложки с возрастным ограничением
 * 3. Отображение длительности и цены
 * 4. Отображение описания мероприятия
 * 
 * Особенности:
 * - Прокручиваемый контейнер
 * - Адаптивная верстка
 * - Условное отображение описания
 * - Форматирование цены
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import { Event } from '@/types/mc';
import { EventCover } from '@/components/pages/mc/EventCover';
import Btn from '@/components/ui/btns/Btn';

/**
 * Пропсы компонента детальной информации
 */
interface EventDetailsProps {
  event: Event;  // Данные мероприятия
}

export const EventDetails: React.FC<EventDetailsProps> = ({ event }) => {
  return (
    <ScrollView style={styles.scrollView} bounces={false}>
      {/* Обложка мероприятия с возрастным ограничением */}
      <EventCover cover={event.cover} ageLimit={event.age_limit} />
      
      <View style={styles.contentContainer}>
        {/* Название мероприятия */}
        <Text style={styles.title}>{event.title}</Text>
        
        {/* Длительность мероприятия */}
        <View style={styles.durationContainer}>
          <Text style={styles.duration}>30 минут</Text>
        </View>

        {/* Кнопка с ценой */}
        <Btn 
          title={`${Number(event.price).toFixed(0)} руб/чел`}
          width="full"
          onPress={() => {}}
        />
        
        {/* Описание мероприятия (если есть) */}
        {event.description && (
          <Text style={styles.description}>
            {event.description}
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

// Стили компонента
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
    paddingBottom: 180,  // Дополнительный отступ для прокрутки
  },
}); 