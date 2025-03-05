import React, { useState, memo } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { TextStyles, Colors } from "@/theme";
import PlaceholderImage from '@/components/images/PlaceholderImage';

const PLACEHOLDER_IMAGE = require('@/assets/images/pattern.png'); // или другой путь к локальному плейсхолдеру

interface NewsCardProps {
  id: number;
  title: string;
  introtext: string;
  cover: string;
}

const NewsCardComponent = memo(({ id, title, introtext, cover }: NewsCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const handlePress = React.useCallback(() => {
    router.push(`/news/${id}`);
  }, [id]);

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <PlaceholderImage 
            source={cover}
            style={styles.image}
          />
        </View>
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {introtext}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    height: 270,
    marginBottom: 8,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: Colors.grayElements,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 25,
  },
  imagePlaceholder: {
    opacity: 0,
  },
  content: {
    paddingTop: 8,
    paddingBottom: 2,
  },
  title: {
    ...TextStyles.h3,
    color: Colors.black,
    marginBottom: 4,
  },
  description: {
    ...TextStyles.textDescription,
    color: Colors.grayText,
  },
});

export default NewsCardComponent; 