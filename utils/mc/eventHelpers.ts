import { Event } from '@/types/mc';
import { getDayOfWeek } from './dateFormatters';

export const groupEventsByDate = (events: Event[], date: Date): Event[] => {
  const currentDayOfWeek = getDayOfWeek(date);
  
  return events.filter((event) => {
    const endDate = new Date(event.repeat_end_date);
    if (date > endDate) return false;
    
    const repeatDays = event.repeat_days.split(",").map(Number);
    return repeatDays.includes(currentDayOfWeek);
  });
};

export const getEventsForSelectedDay = (events: Event[], selectedDate: Date): Event[] => {
  const currentDayOfWeek = getDayOfWeek(selectedDate);

  return events.filter((event) => {
    const endDate = new Date(event.repeat_end_date);
    if (selectedDate > endDate) return false;

    const repeatDays = event.repeat_days.split(",").map(Number);
    return repeatDays.includes(currentDayOfWeek);
  });
}; 