import React, { useRef, useCallback, useState } from "react";
import { View, ScrollView, Image, StyleSheet, Dimensions } from "react-native";
import { Colors } from "@/theme";
import { Calendar } from "@/widgets/mc/Calendar";
import { EventsList } from "@/widgets/mc/EventsList";
import { ScrollToTop } from "@/widgets/mc/ScrollToTop";
import { useEvents } from "@/hooks/mc/useEvents";
import { useVisibleDates } from "@/hooks/mc/useVisibleDates";
import { useCalendarState } from "@/hooks/mc/useCalendarState";
import { LoadingState } from "@/components/ui/feedback/LoadingState";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import CustomRefreshControl from "@/components/ui/feedback/RefreshControl";
import MainHeader from "@/components/ui/layout/MainHeader";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CalendarPage = () => {
  const scrollViewRef = useRef<ScrollView>(null);
  const { selectedDate, handleDateSelect } = useCalendarState();
  const { events, isLoading, refresh } = useEvents();
  const {
    visibleDates,
    isLoadingMore,
    loadMoreDates,
  } = useVisibleDates(selectedDate);
  const [showScrollTop, setShowScrollTop] = React.useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

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

  const renderContent = () => {
    if (isLoading && !events?.length) {
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
        refreshControl={
          <CustomRefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
          />
        }
      >
        
        <View style={styles.calendarContainer}>
          <Image 
            source={require('@/assets/images/pattern.webp')} 
            style={styles.pattern}
            resizeMode="cover"
          />
          <MainHeader colorEditPark={Colors.white} colorIconContact={Colors.white} colorIconTheme={Colors.white} colorPark={Colors.white} />
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

export default CalendarPage; 