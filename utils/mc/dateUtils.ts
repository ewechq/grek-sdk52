export const generateDays = (selectedDate: Date): Date[] => {
  const days: Date[] = [];
  const today = new Date();
  
  // Генерируем дни за 5 дней до и после выбранной даты
  for (let i = -5; i <= 5; i++) {
    const date = new Date(selectedDate);
    date.setDate(selectedDate.getDate() + i);
    days.push(date);
  }
  
  return days;
};

export const formatMonthName = (date: Date): string => {
  return date.toLocaleDateString("ru-RU", { month: "long" });
}; 