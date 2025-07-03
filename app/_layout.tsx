import React from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'VelaSans-Light': require('../assets/fonts/VelaSans-Light.ttf'),
    'VelaSans-Regular': require('../assets/fonts/VelaSans-Regular.ttf'),
    'VelaSans-Medium': require('../assets/fonts/VelaSans-Medium.ttf'),
    'VelaSans-SemiBold': require('../assets/fonts/VelaSans-SemiBold.ttf'),
    'VelaSans-Bold': require('../assets/fonts/VelaSans-Bold.ttf'),
    ...Ionicons.font,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <StatusBar style='dark'/>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(buyticket)" />
        <Stack.Screen name="(price)" />
        <Stack.Screen name="(paybycard)" />
      </Stack>
    </ThemeProvider>
  );
}
