import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { Typography, Colors } from "@/theme";
import Header from "@/components/ui/layout/Header";
import Btn from "@/components/ui/btns/Btn";
import CustomRefreshControl from "@/components/ui/feedback/RefreshControl";
import { CustomActivityIndicator } from "@/components/ui/feedback/ActivityIndicator";

interface Event {
  id: number;
  title: string;
  description: string | null;
  date_start: string;
  cover: string | null;
  price: string | null;
  price_type: string | null;
  age_limit: number;
  duration?: string;
  repeat_days: string;
  repeat_end_date: string;
}

const { width } = Dimensions.get('window');

const MKDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEventDetail = useCallback(async () => {
    try {
      const response = await fetch("https://api.grekland.ru/api/events");
      const data = await response.json();
      const item = data.find((item: Event) => item.id === Number(id));     
      setEvent(item);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching event detail:", error);
      setIsLoading(false);
    }
  }, [id]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEventDetail();
    setRefreshing(false);
  };

  useEffect(() => {
    if (id) {
      fetchEventDetail();
    }
  }, [id, fetchEventDetail]);

  if (isLoading && !event) {
    return (
      <View style={styles.loadingContainer}>
        <CustomActivityIndicator />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.errorContainer}>
        <Text>Мероприятие не найдено</Text>
      </View>
    );
  }

  // Определяем текст для кнопки в зависимости от цены
  const priceText = event.price && parseFloat(event.price) > 0 
    ? `${Number(event.price).toFixed(0)} руб/${event.price_type || 'чел'}`
    : "БЕСПЛАТНО";

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <CustomRefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
    >
      <Header title="Подробнее" marginTop={32}/>
      <View style={styles.contentWrapper}>
        <View style={styles.coverContainer}>
          <Image
            style={styles.image}
            source={{ uri: event.cover || undefined }}
            contentFit="cover"
          />
          <View style={styles.ageLimitWrapper}>
            <Text style={styles.ageLimit}>{event.age_limit}+</Text>
          </View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>30 минут</Text>
            
          </View>
          <Btn title={priceText} width="full" onPress={() => {}}/>
          
          {event.description && (
            <Text style={styles.description}>
              {event.description}
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 1,
  },
  backButton: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: Colors.grayBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageLimitContainer: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: Colors.grayBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageLimit: {
    color: Colors.purple,
    ...Typography.h2(),
    paddingTop: 5,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
    
    borderRadius: 25,
    position: 'relative',
  },
  contentContainer: {

  },
  title: {
    ...Typography.h2(),
    alignSelf: 'center',
    textAlign: 'center',
  },
  durationContainer: {
    marginTop: 8,
    marginBottom: 24,
    ...Typography.small(),
  },
  duration: {
    ...Typography.small(),
    alignSelf: 'center',
  },

  description: {
    ...Typography.caption(),
    color: Colors.black,
    marginBottom: 32,
    paddingBottom: 180,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverContainer: {
    marginTop: 24,
    marginBottom: 15,
    position: 'relative',
  },
  ageLimitWrapper: {
    position: 'absolute', 
    right: 0, 
    top: 0,
    width: 50, 
    height: 50, 
    backgroundColor: Colors.white, 
    borderTopRightRadius: 24, 
    borderBottomLeftRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
});

export default MKDetail;