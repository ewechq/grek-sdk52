import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from '../contexts/auth';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    'Gothic60': require('../assets/fonts/Gothic60.ttf'),
    'Inter-Regular': require('../assets/fonts/Inter-Regular.otf'),
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
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
