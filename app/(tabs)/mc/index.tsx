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
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import CardComponent, { ChildComponentProps } from "@/components/cards/CardComponent";
import { TextStyles, Colors } from "@/theme";

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

  useEffect(() => {
    setDays(generateDays(selectedDate));
  }, [selectedDate]);

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

  const generateDays = (centerDate: Date) => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date(centerDate);
      date.setDate(centerDate.getDate() + i - 15);
      return date;
    });
  };

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

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
    setShowDatePicker(false);
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

    // Показываем кнопку, если прошло больше 2 дней (примерно 600px)
    setShowScrollTop(offsetY > 600);

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
    <View style={{ flex: 1 }}>
      <ScrollView 
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.container}>
          <View style={styles.calendarContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 16,
              }}
            >
              <View style={{ gap: 4 }}>
                <Text style={{ ...TextStyles.h2, marginTop: 4 }}>Афиша</Text>
                <Text style={styles.monthName}>
                  {monthName.charAt(0).toUpperCase() + monthName.slice(1)}
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  width: 80,
                  height: 40,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: Colors.grayBg,
                  borderRadius: 15,
                }}
                onPress={() => setShowDatePicker(true)}
              >
                <Ionicons
                  name="calendar-clear-outline"
                  size={18}
                  color={Colors.black}
                />
              </TouchableOpacity>
            </View>

            <FlatList
              ref={flatListRef}
              horizontal
              data={days}
              keyExtractor={(item) => item.toDateString()}
              getItemLayout={getItemLayout}
              onScrollToIndexFailed={handleScrollToIndexFailed}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDate(item);
                  }}
                  style={[
                    styles.dayContainer,
                    selectedDate.toDateString() === item.toDateString() &&
                      styles.selectedDayContainer,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      selectedDate.toDateString() === item.toDateString() &&
                        styles.selectedDayText,
                    ]}
                  >
                    {item.getDate()}
                  </Text>
                  <Text
                    style={[
                      styles.weekdayText,
                      selectedDate.toDateString() === item.toDateString() &&
                        styles.selectedWeekdayText,
                    ]}
                  >
                    {item.toLocaleDateString("ru-RU", { weekday: "short" })}
                  </Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.flatListContent}
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              decelerationRate="fast"
              pagingEnabled={false}
              initialNumToRender={7}
              maxToRenderPerBatch={7}
              windowSize={7}
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

      {showScrollTop && (
        <TouchableOpacity 
          style={styles.scrollTopButton}
          onPress={scrollToTop}
        >
          <Ionicons 
            name="arrow-up" 
            size={24} 
            color={Colors.white}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const MasterClassScreen = () => {
  return (
    <View style={{ flex: 1 }}>
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
    paddingTop: 30,
    
  },

  title: {
    ...TextStyles.h2,
  },
  iconContainer: {
    padding: 20,
    borderRadius: 50,
    backgroundColor: Colors.grayBg,
  },
  monthName: {
    ...TextStyles.textDescription,
    color: Colors.grayText,
  },
  flatListContent: {
    paddingVertical: 10,
    marginBottom: 24,
  },
  dayContainer: {
    padding: 24,
    borderRadius: 25,
  },
  selectedDayContainer: {
    backgroundColor: Colors.purple,
  },
  dayText: {
    ...TextStyles.h3Number,
    color: Colors.black,
  },
  selectedDayText: {
    color: Colors.white,
  },
  weekdayText: {
    textAlign: "center",
    color: Colors.black,
    ...TextStyles.text,
  },
  selectedWeekdayText: {
    color: Colors.white,
    ...TextStyles.text,
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
    paddingTop: 20,
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
    ...TextStyles.h2,
    color: Colors.black,
    marginBottom: 16,
  },
  loaderContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
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
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
