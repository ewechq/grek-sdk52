import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { TextStyles, Colors } from "@/theme";

interface NewsCardProps {
  id: number;
  title: string;
  introtext: string;
  site_cover: string;
}

const NewsCardComponent = ({ id, title, introtext, site_cover }: NewsCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const handlePress = () => {
    router.push(`/news/${id}`);
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <Image
          source={{ uri: site_cover }}
          style={[styles.image, !isLoaded && styles.imagePlaceholder]}
          onLoad={() => setIsLoaded(true)}
        />
        {isLoaded && (
          <View style={styles.content}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
              {title}
            </Text>
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
              {introtext}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 240,
    marginBottom: 8,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 25,
    
  },
  imagePlaceholder: {
    backgroundColor: Colors.grayElements,
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