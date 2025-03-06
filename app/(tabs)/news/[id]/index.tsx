import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Image } from "expo-image";
import Header from "@/components/Header";
import { Colors, TextStyles } from "@/theme";
import { useArticles } from '@/hooks/useArticles';
import PlaceholderImage from "@/components/images/PlaceholderImage";
import HtmlContent from "@/components/text/HtmlContent";

const NewsDetail = () => {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const { articles, isLoading, error } = useArticles();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const newsItem = useMemo(() => {
    if (!id) return null;
    const item = articles.find(item => item.id === Number(id));
    return item;
  }, [articles, id]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.purple} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  if (!newsItem) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>Новость не найдена</Text>
      </View>
    );
  }

  const formattedDate = format(
    new Date(newsItem.created_at),
    "dd MMM yyyy",
    { locale: ru }
  );

  return (
    <ScrollView style={styles.scrollView}>
      <Header title='Подробнее' marginTop={32}/>

      <View style={styles.imageContainer}>
        {newsItem.cover && !imageError ? (
          <>
            <Image
              source={{ uri: newsItem.cover }}
              style={[styles.image, StyleSheet.absoluteFill]}
              contentFit="cover"
              transition={200}
              onLoadStart={() => setImageLoading(true)}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
            {imageLoading && (
              <View style={[StyleSheet.absoluteFill, styles.imagePlaceholderContainer]}>
                <PlaceholderImage style={styles.image} />
              </View>
            )}
          </>
        ) : (
          <PlaceholderImage style={styles.image} />
        )}
      </View>

      <View style={[styles.contentContainer, !newsItem.cover && styles.contentContainerNoCover]}>
        <Text style={styles.title}>{newsItem.title}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <HtmlContent html={newsItem.content} style={styles.content} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
    backgroundColor: "white",
    paddingBottom: 200,
  },
  imageContainer: {
    width: "90%",
    height: undefined,
    aspectRatio: 1,
    backgroundColor: Colors.grayBg,
    borderRadius: 40,
    alignSelf: 'center',
    marginVertical: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholderContainer: {
    backgroundColor: Colors.grayBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: 140,
  },
  contentContainerNoCover: {
    marginTop: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  title: {
    ...TextStyles.h2,
    marginBottom: 10,
    textAlign: 'center',
  },
  date: {
    ...TextStyles.text,
    color: Colors.grayText,
    marginBottom: 20,
    textAlign: 'center',
  },
  content: {
    color: Colors.black,
    lineHeight: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  error: {
    ...TextStyles.text,
    color: 'red',
    textAlign: 'center',
  },
});

export default NewsDetail;