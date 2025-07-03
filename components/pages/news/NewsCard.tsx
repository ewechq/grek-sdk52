import React, { memo, useCallback, useMemo, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Colors, Typography } from '@/theme';
import { PlaceholderImage } from '@/components/ui/images/PlaceholderImage';

const IS_ANDROID = Platform.OS === 'android';

interface NewsCardProps {
  id: number;
  title: string;
  introtext: string;
  cover: string;
}

const NewsCard = memo(({ id, title, introtext, cover }: NewsCardProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handlePress = useCallback(() => {
    router.push({
      pathname: '/(tabs)/news/[id]',
      params: { id: id.toString() }
    });
  }, [id]);

  const imageUri = useMemo(() => {
    if (!cover) return null;
    const quality = IS_ANDROID ? 60 : 80;
    const width = IS_ANDROID ? 300 : 400;
    return cover.includes('?') 
      ? `${cover}&quality=${quality}&w=${width}` 
      : `${cover}?quality=${quality}&w=${width}`;
  }, [cover]);

  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <Pressable 
      style={styles.container} 
      onPress={handlePress}
    >
      <View style={styles.imageContainer}>
        {imageUri && !hasError ? (
          <>
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              contentFit="cover"
              cachePolicy="memory-disk"
              onError={handleError}
              onLoadEnd={handleLoadEnd}
            />
            {isLoading && <PlaceholderImage style={StyleSheet.absoluteFill} />}
          </>
        ) : (
          <PlaceholderImage style={styles.image} />
        )}
      </View>
      <View style={styles.content}>
        <Text 
          style={styles.title}
          numberOfLines={2}
          ellipsizeMode='tail'
        >
          {title}
        </Text>
        <Text 
          style={styles.description}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {introtext}
        </Text>
      </View>
    </Pressable>
  );
}, (prevProps, nextProps) => {
  return prevProps.id === nextProps.id && 
         prevProps.cover === nextProps.cover &&
         prevProps.title === nextProps.title &&
         prevProps.introtext === nextProps.introtext;
});

const styles = StyleSheet.create({
  container: {
    height: 270,
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.grayElements,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  content: {
    paddingTop: 8,
    paddingBottom: 2,
  },
  titleContainer: {
    marginBottom: 4,
  },
  title: {
    ...Typography.h3(),
    color: Colors.black,
    marginBottom: 4,
  },
  description: {
    ...Typography.small(),
    color: Colors.grayText,
  },
});

export default NewsCard; 