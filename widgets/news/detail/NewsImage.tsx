import React, { useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/theme';
import PlaceholderImage from '@/components/images/PlaceholderImage';

const IS_ANDROID = Platform.OS === 'android';

interface NewsImageProps {
  imageUri: string | null;
}

export const NewsImage = ({ imageUri }: NewsImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  const handleImageLoadEnd = () => {
    setIsImageLoading(false);
  };

  return (
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
  );
};

const styles = StyleSheet.create({
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
});