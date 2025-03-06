import React, { useState, memo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Colors, TextStyles } from '@/theme';
import PlaceholderImage from '@/components/images/PlaceholderImage';

interface NewsCardProps {
  id: number;
  title: string;
  introtext: string;
  cover: string;
}

const NewsCard = memo(({ id, title, introtext, cover }: NewsCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handlePress = () => {
    console.log('Navigating to news detail:', id);
    router.push({
      pathname: '/(tabs)/news/[id]',
      params: { id: id.toString() }
    });
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {cover && !hasError ? (
          <Image
            source={{ uri: cover }}
            style={styles.image}
            contentFit="cover"
            transition={200}
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        ) : null}
        {(!cover || isLoading || hasError) && (
          <View style={StyleSheet.absoluteFill}>
            <PlaceholderImage 
              source={cover || ''}
              style={StyleSheet.absoluteFill}
            />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text 
          style={styles.title}
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text 
          style={styles.description}
          numberOfLines={2}
        >
          {introtext}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 270,
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: Colors.grayElements,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
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

export default NewsCard; 