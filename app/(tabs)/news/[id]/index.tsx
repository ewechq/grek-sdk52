import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  useWindowDimensions,
  Platform,
  TextStyle,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Image } from "expo-image";
import Header from "@/components/Header";
import { Colors, TextStyles } from "@/theme";
import { useArticlesStore } from '@/hooks/news/useArticlesCache';
import HtmlContent from "@/components/text/HtmlContent";
import { NewsItem } from "@/types/news";
import PlaceholderImage from "@/components/images/PlaceholderImage";

const IS_ANDROID = Platform.OS === 'android';

const NewsDetail = () => {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const { articles, isLoading, error } = useArticlesStore();
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const newsItem = useMemo(() => {
    if (!id) return null;
    const item = articles.find((item: NewsItem) => item.id === Number(id));
    return item;
  }, [articles, id]);

  const imageUri = useMemo(() => {
    if (!newsItem?.cover) return null;
    const quality = IS_ANDROID ? 60 : 80;
    return newsItem.cover.includes('?') 
      ? `${newsItem.cover}&quality=${quality}` 
      : `${newsItem.cover}?quality=${quality}`;
  }, [newsItem?.cover]);

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoadEnd = () => {
    setIsImageLoading(false);
  };

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
    <ScrollView 
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <Header title='Подробнее' marginTop={32}/>

      <View style={styles.imageContainer}>
        {imageUri && !imageError ? (
          <>
            <Image
              source={{ uri: imageUri }}
              style={[styles.image, !isImageLoading && styles.loadedImage]}
              contentFit="cover"
              transition={IS_ANDROID ? 0 : 200}
              cachePolicy="memory-disk"
              priority={IS_ANDROID ? "high" : "normal"}
              onError={handleImageError}
              onLoadEnd={handleImageLoadEnd}
            />
            {isImageLoading && <PlaceholderImage style={StyleSheet.absoluteFill} />}
          </>
        ) : (
          <PlaceholderImage style={styles.image} />
        )}
      </View>

      <View style={[
        styles.contentContainer, 
        !imageUri && styles.contentContainerNoCover
      ]}>
        <Text style={[
          styles.title, 
          IS_ANDROID && styles.androidText
        ]}>
          {newsItem.title}
        </Text>
        <Text style={[
          styles.date, 
          IS_ANDROID && styles.androidText
        ]}>
          {formattedDate}
        </Text>
        <HtmlContent 
          html={newsItem.content} 
          style={styles.content as TextStyle} 
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
    backgroundColor: "white",
    paddingBottom: IS_ANDROID ? 100 : 200,
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
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loadedImage: {
    opacity: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: IS_ANDROID ? 80 : 140,
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
  androidText: {
    includeFontPadding: false,
    textAlignVertical: 'center',
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