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