import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import CardComponent, { ChildComponentProps } from "@/components/cards/CardComponent";
import { TextStyles, Colors } from "@/theme";
import { CalendarHeader } from "@/components/blocks/mk/CalendarHeader";
import { DaysSlider } from "@/components/blocks/mk/DaysSlider";
import { ScrollTopButton } from "@/components/btns/ScrollTopButton";
import { DatePickerModal } from "@/components/modals/DatePickerModal";

interface Event {
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

const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [days, setDays] = useState<Date[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const router = useRouter();

  const [newsData, setNewsData] = useState<ChildComponentProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [visibleDates, setVisibleDates] = useState<Date[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Добавим состояние для хранения начальной даты (сегодня)
  const [initialDate] = useState(new Date());

  const getDayOfWeek = (date: Date): number => {
    const day = date.getDay();
    return day === 0 ? 7 : day;
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("https://api.grekland.ru/api/events", {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        const filteredData = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          cover: item.cover ? { uri: item.cover } : null,
          price: item.price,
          price_type: item.price_type,
          age_limit: item.age_limit,
          date_start: item.date_start
        }));

        setNewsData(filteredData);
      } catch (error) {
        setNewsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const generateDays = (centerDate: Date) => {
    // Создаем новую дату и обнуляем время
    const center = new Date(centerDate);
    center.setHours(0, 0, 0, 0);
    
    // Генерируем массив из 15 дней (7 до + текущий + 7 после)
    return Array.from({ length: 15 }, (_, i) => {
      const date = new Date(center);
      date.setDate(center.getDate() - 7 + i);
      return date;
    });
  };

  // Обновляем useEffect для генерации дней
  useEffect(() => {
    // Генерируем дни при первом рендере
    setDays(generateDays(selectedDate));
  }, []); 

  useEffect(() => {
    if (days.length > 0) {
      scrollToSelectedDate(selectedDate, true);
    }
  }, [days]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://api.grekland.ru/api/events", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        setEvents(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error("Сообщение ошибки:", error.message);
          console.error("Стек ошибки:", error.stack);
        }
      }
    };

    fetchEvents();
  }, []);

  const scrollToSelectedDate = (date: Date, shouldAnimate: boolean = false) => {
    const index = days.findIndex(
      (d) => d.toDateString() === date.toDateString()
    );
    if (index !== -1 && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index,
        animated: shouldAnimate,
        viewPosition: 1.2,
      });
    }
  };

  // Обновляем обработчик выбора даты в календаре
  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);
      setSelectedDate(newDate);
      // Генерируем новый массив дат с выбранной датой в центре
      setDays(generateDays(newDate));
    }
    setShowDatePicker(false);
  };

  // Обработчик нажатия на день в слайдере
  const handleDayPress = (date: Date) => {
    setSelectedDate(date);
    // При выборе даты из слайдера НЕ генерируем новый массив дат
  };

  const monthName = selectedDate.toLocaleDateString("ru-RU", { month: "long" });

  const getEventsForSelectedDay = () => {
    const currentDayOfWeek = getDayOfWeek(selectedDate);

    return events.filter((event) => {
      // Проверяем, действительно ли событие еще актуально
      const endDate = new Date(event.repeat_end_date);
      if (selectedDate > endDate) return false;

      // Проверяем, повторяется ли событие в выбранный день недли
      const repeatDays = event.repeat_days.split(",").map(Number);
      return repeatDays.includes(currentDayOfWeek);
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getItemLayout = (data: any, index: number) => ({
    length: 80, // Высота элемента + отступы
    offset: 80 * index,
    index,
  });

  const handleScrollToIndexFailed = (info: {
    index: number;
    highestMeasuredFrameIndex: number;
    averageItemLength: number;
  }) => {
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: info.index,
          animated: false,
          viewPosition: 1.2,
        });
      }
    });
  };

  // Функция для группировки событий по датам
  const groupEventsByDate = (date: Date) => {
    const currentDayOfWeek = getDayOfWeek(date);
    return events.filter((event) => {
      const endDate = new Date(event.repeat_end_date);
      if (date > endDate) return false;
      const repeatDays = event.repeat_days.split(",").map(Number);
      return repeatDays.includes(currentDayOfWeek);
    });
  };

  // Обработчик прокрутки
  const handleScroll = async (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;

    // Показываем кнопку, если прошло больше 2 дней (примерно 800px)
    setShowScrollTop(offsetY > 800);

    if (offsetY + screenHeight >= contentHeight - 20 && !isLoadingMore) {
      setIsLoadingMore(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const lastDate = visibleDates[visibleDates.length - 1];
      const nextDate = new Date(lastDate);
      nextDate.setDate(nextDate.getDate() + 1);
      setVisibleDates(prev => [...prev, nextDate]);
      setIsLoadingMore(false);
    }
  };

  // Инициализация первой даты при монтировании
  useEffect(() => {
    setVisibleDates([selectedDate]);
  }, [selectedDate]);

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>

      <ScrollView 
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.container}>
          <View style={styles.calendarContainer}>
            <Image source={require('@/assets/images/pattern-on-white2.png')} style={{position: 'absolute', top: 0, left: 0, width: '110%', height: '100%', opacity: 0.4}} resizeMode='cover'/>
            <CalendarHeader 
              monthName={monthName} 
              onCalendarPress={() => setShowDatePicker(true)}
            />

            <DaysSlider
              days={days}
              selectedDate={selectedDate}
              onDayPress={handleDayPress}
              flatListRef={flatListRef}
            />

            {showDatePicker && (
              <Modal
                transparent={true}
                animationType="slide"
                visible={showDatePicker}
                onRequestClose={() => setShowDatePicker(false)}
              >
                <View style={styles.modalBackground}>
                  <View style={styles.modalContainer}>
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="inline"
                      onChange={onChange}
                      locale="ru-RU"
                      style={styles.dateTimePicker}
                    />
                  </View>
                </View>
              </Modal>
            )}
          </View>

          {/* Отображение событий по датам */}
          {visibleDates.map((date, index) => {
            const dateEvents = groupEventsByDate(date);
            if (dateEvents.length === 0) return null;

            return (
              <View key={date.toISOString()} style={styles.dateEventsContainer}>
                <Text style={styles.dateHeader}>
                  {date.toLocaleDateString('ru-RU', { 
                    day: 'numeric',
                    month: 'long'
                  })}
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
                            : require("../../../assets/images/addImg.png")
                        }
                        time={formatTime(event.date_start)}
                        price={event.price ? parseFloat(event.price) : undefined}
                        ageLimit={event.age_limit}
                      />
                    </View>
                  ))}
                </View>
              </View>
            );
          })}

          {isLoadingMore && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.purple} />
            </View>
          )}
        </View>
      </ScrollView>

      {showScrollTop && <ScrollTopButton onPress={scrollToTop} />}
      
      <DatePickerModal
        visible={showDatePicker}
        selectedDate={selectedDate}
        onChange={onChange}
        onClose={() => setShowDatePicker(false)}
      />
    </View>
  );
};

const MasterClassScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar 
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <CalendarComponent />
    </View>
  );
};

export default MasterClassScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingBottom: 100,
  },
  calendarContainer: {
    marginTop: 24,
    marginBottom: 24,
    backgroundColor: Colors.purple,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderRadius: 25,
  },
  loaderContainer: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "black",
    borderRadius: 50,
    padding: 16,
  },
  dateTimePicker: {
    backgroundColor: "black",
  },
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  eventsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingTop: 16,
  },
  cardWrapper: {
    width: "48%",
    marginBottom: 20,
  },
  dateEventsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  dateHeader: {
    ...TextStyles.h3,
    color: Colors.grayText,
    textAlign: 'right',

  },
  scrollTopButton: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
