import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Colors, TextStyles } from '@/theme';
import { PlaceholderImage } from '@/components/images/PlaceholderImage';

interface NewsCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  isPromo?: boolean;
}

export const NewsCard = ({ id, title, description, image, isPromo }: NewsCardProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handlePress = () => {
    router.push(`/(tabs)/news/${id}`);
  };

  return (
    <TouchableOpacity 
      style={[styles.container, isPromo && styles.promoContainer]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {image && !hasError ? (
          <Image
            source={{ uri: image }}
            style={[styles.image, isPromo && styles.promoImage]}
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
        {(!image || isLoading || hasError) && (
          <View style={[StyleSheet.absoluteFill, isPromo && styles.promoImage]}>
            <PlaceholderImage 
              source={image || ''}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
            />
          </View>
        )}
      </View>
      <View style={ isPromo && styles.promoContent}>
        <Text 
          style={[styles.title, isPromo && styles.promoTitle]} 
          numberOfLines={2}
        >
          {title}
        </Text>
        <Text 
          style={[styles.description, isPromo && styles.promoDescription]} 
          numberOfLines={2}
        >
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {

    overflow: 'hidden',
  },
  promoContainer: {
    height: 400,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1, 
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  promoImage: {
    aspectRatio: undefined,
    height: 250,
  },

  promoContent: {
    padding: 16,
  },
  title: {
    ...TextStyles.h3,
    marginTop: 8,
  },
  promoTitle: {
    ...TextStyles.h2,
    marginBottom: 8,
  },
  description: {
    ...TextStyles.text,
    color: Colors.grayText,
  },
  promoDescription: {
    ...TextStyles.text,
    fontSize: 16,
  },
}); 