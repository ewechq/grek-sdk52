import React, { useRef, useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "@/theme";
import { Calendar } from "@/widgets/mc/Calendar";
import { EventsList } from "@/widgets/mc/EventsList";
import { ScrollToTop } from "@/widgets/mc/ScrollToTop";
import { useEvents } from "@/hooks/mc/useEvents";
import { useVisibleDates } from "@/hooks/mc/useVisibleDates";
import { LoadingState } from "@/components/state/LoadingState";
import { EmptyState } from "@/components/state/EmptyState";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CalendarPage = () => {
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { events, isLoading } = useEvents();
  const {
    visibleDates,
    isLoadingMore,
    loadMoreDates,
  } = useVisibleDates(selectedDate);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const screenHeight = event.nativeEvent.layoutMeasurement.height;

    setShowScrollTop(offsetY > 600);

    if (offsetY + screenHeight >= contentHeight - 20 && !isLoadingMore) {
      loadMoreDates();
    }
  }, [isLoadingMore, loadMoreDates]);

  const scrollToTop = useCallback(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.whiteContainer}>
            <LoadingState loading={true} />
          </View>
        </View>
      );
    }

    if (!events?.length) {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.whiteContainer}>
            <EmptyState message="Информация отсутствует" />
          </View>
        </View>
      );
    }

    return (
      <EventsList
        events={events}
        visibleDates={visibleDates}
        isLoadingMore={isLoadingMore}
        selectedDate={selectedDate}
        onEmpty={() => <EmptyState message="Информация отсутствует" />}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.calendarContainer}>
          <Image 
            source={require('@/assets/images/pattern.png')} 
            style={styles.pattern}
            resizeMode="cover"
          />
          <Calendar 
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect} 
          />
        </View>
        
        {renderContent()}
      </ScrollView>

      <ScrollToTop
        visible={showScrollTop}
        onPress={scrollToTop}
      />
    </View>
  );
};

export default CalendarPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.purple,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: SCREEN_HEIGHT,
  },
  pattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  calendarContainer: {
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
  },
  whiteContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
