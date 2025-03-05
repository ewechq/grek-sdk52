export interface Event {
  id: number;
  title: string;
  description: string | null;
  date_start: string;
  cover: string | null;
  price: string | null;
  price_type: string | null;
  age_limit: number;
  repeat_days: string;
  repeat_end_date: string;
}

export interface VisibleDatesState {
  dates: Date[];
  isLoading: boolean;
}

export interface CalendarState {
  selectedDate: Date;
  showDatePicker: boolean;
} 