import React, { useEffect } from 'react';
import { StyleSheet, View, Animated, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/theme';

interface PlaceholderImageProps {
  source?: string;
  style?: any;
}

// Прекешируем изображение плейсхолдера
const placeholderImage = require('@/assets/images/placeholder.webp');

// Создаем один общий Animated.Value для всех инстансов
const rotateAnimation = new Animated.Value(0);

// Создаем анимацию один раз
Animated.loop(
  Animated.sequence([
    Animated.timing(rotateAnimation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }),
    Animated.timing(rotateAnimation, {
      toValue: -1,
      duration: 1000,
      useNativeDriver: true,
    }),
    Animated.timing(rotateAnimation, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }),
  ])
).start();

export const PlaceholderImage: React.FC<PlaceholderImageProps> = React.memo(({ style }) => {
  const rotate = rotateAnimation.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-5deg', '0deg', '5deg']
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View style={[styles.animatedContainer, { transform: [{ rotate }] }]}>
        <Image
          source={placeholderImage}
          style={styles.placeholderImage}
          contentFit="contain"
          cachePolicy="memory"
        />
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.grayBg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
  animatedContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderImage: {
    width: 100,
    height: 100,
  },
}); 