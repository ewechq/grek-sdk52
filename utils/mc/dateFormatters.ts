export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ru-RU', { 
    day: 'numeric',
    month: 'long'
  });
};

export const getDayOfWeek = (date: Date): number => {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}; 

export const formatDateWithWeekday = (date: Date): string => {
  const weekday = date.toLocaleDateString('ru-RU', { weekday: 'long' });
  const dayMonth = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  return `${capitalizeFirstLetter(weekday)}, ${dayMonth}`;
};

export const formatCalendarDay = (date: Date): string => {
  // Короткое название дня недели с заглавной буквы (например, 'Пн')
  const shortWeekday = date.toLocaleDateString('ru-RU', { weekday: 'short' });
  return capitalizeFirstLetter(shortWeekday);
};

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
} 