import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Animated, Easing, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/theme';

interface PlaceholderImageProps {
  source?: string;
  style?: any;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ source, style }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <View style={[styles.container, style]}>
      {source && (
        <Image
          source={{ uri: source }}
          style={[styles.image, !isLoading && styles.loadedImage]}
          contentFit="cover"
          cachePolicy="memory-disk"
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
        />
      )}
      <View style={[
        styles.placeholderContainer,
        { opacity: source ? 1 : 1 }
      ]}>
        <Image 
          source={require('@/assets/images/pattern.png')}
          style={styles.backgroundPlaceholderImage}
          contentFit="cover"
          cachePolicy="memory"
        />
        <View style={[
          styles.placeholderWrapper,
          
        ]}>
          <Image
            source={require('@/assets/images/placeholder2.png')}
            style={styles.placeholderImage}
            contentFit="cover"
            cachePolicy="memory"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: Colors.grayBg,
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    ...Platform.select({
      ios: {
        position: 'absolute',
        zIndex: 1,
      },
      android: {
        position: 'absolute',
        elevation: 1,
      },
    }),
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      android: {
        elevation: 2,
      }
    }),
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    opacity: 0,
  },
  loadedImage: {
    opacity: 1,
  },
  placeholderImage: {
    width: 150,
    height: 150,
  },
  backgroundPlaceholderImage: {
    width: '200%',
    height: '200%',
    position: 'absolute',
    top: -50,
    left: -50,
    right: 0,
    bottom: 0,
    tintColor: 'rgba(0, 0, 0, 0.15)'
  },
});

export default React.memo(PlaceholderImage); 