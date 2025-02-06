import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { TextStyles, Colors } from "@/theme";
import Header from "@/components/Header";
import Btn from "@/components/btns/Btn";

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

  useEffect(() => {
    const fetchEventDetail = async () => {
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
    };

    if (id) {
      fetchEventDetail();
    }
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.purple} />
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

  return (
    <ScrollView style={styles.container}>
      <Header title="Подробнее" marginTop={32}/>
      <ScrollView style={styles.scrollView} bounces={false}>
        <View style={{marginTop: 24,
    marginBottom: 15,}}>
        <Image
          style={styles.image}
          source={{ uri: event.cover || undefined }}
          contentFit="cover"
        />
        <View style={{position: 'absolute', right: 0, top: 0,width: 50, height: 50, backgroundColor: Colors.white, borderTopRightRadius: 24, borderBottomLeftRadius: 25, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{...TextStyles.h2, color: Colors.purple}}>3+</Text></View>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{event.title}</Text>
          
          <View style={styles.durationContainer}>
            <Text style={styles.duration}>30 минут</Text>
            
          </View>
          <Btn title={`${Number(event.price).toFixed(0)} руб/чел`}  width="full" onPress={() => {}}/>
          
          {event.description && (
            <Text style={styles.description}>
              {event.description}
            </Text>
          )}
        </View>
      </ScrollView>

      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    
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
    ...TextStyles.h2,
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
    ...TextStyles.h2,
    alignSelf: 'center',
  },
  durationContainer: {
    marginTop: 8,
    marginBottom: 24,
    ...TextStyles.textDescription,
  },
  duration: {
    ...TextStyles.textDescription,
    alignSelf: 'center',
  },

  description: {
    ...TextStyles.text,
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
});

export default MKDetail;