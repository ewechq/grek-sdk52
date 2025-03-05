import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors } from '@/theme';

export default function SplashScreen() {
  const router = useRouter();
  const rotateAnim = new Animated.Value(0);
  const progressAnim = new Animated.Value(0);

  useEffect(() => {
    // Анимация вращения
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 0.4,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -0.4,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Анимация прогресс-бара
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 3000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();

    // Таймер для перехода на основной экран
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 3000); // 3 секунды

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-20deg', '0deg', '20deg'],
  });

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/bg-light.png')}
        style={styles.backgroundImage}
        contentFit="cover"
      />
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Image
          source={require('@/assets/images/grek.png')}
          style={styles.logo}
          contentFit="contain"
        />
      </Animated.View>
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              })
            }
          ]}
        />
        <Animated.Text style={styles.progressText}>
          {progressAnim.interpolate({
            inputRange: [0, 100],
            outputRange: ['0%', '100%'],
          })}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    width: 300,
    height: 300,
  },
  backgroundImage: {
    width: '100%',
    height: '110%',
    position: 'absolute',
    alignSelf: 'flex-end',
    top: 0,
    right: 0,
  },
  progressContainer: {
    width: '90%',
    height: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
    alignSelf: 'center',
    bottom: 10,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.purple,
    borderRadius: 10,
  },
  progressText: {
    position: 'absolute',
    alignSelf: 'center',
    fontSize: 12,
    color: Colors.purple,
  },
}); 