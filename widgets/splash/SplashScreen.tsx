/**
 * Виджет загрузочного экрана приложения
 * 
 * Функциональность:
 * 1. Отображает логотип
 * 2. Проверяет наличие обновлений приложения
 * 3. Показывает модальное окно обновления при необходимости
 * 4. Автоматически перенаправляет на главный экран
 * 
 * Особенности:
 * - Блокирует кнопку "назад" при наличии обязательного обновления
 * - Кэширует фоновое изображение
 * - Отображает текущую версию приложения
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, BackHandler, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors, TextStyles } from '@/theme';
import { useVersionCheck } from '@/hooks/version/useVersionCheck';
import { UpdateModal } from '@/components/ui/modals/UpdateModal';

const { width, height } = Dimensions.get('window');

export const SplashScreenWidget = () => {
  const router = useRouter();
  const {
    version,
    serverVersion,
    showUpdateModal,
    hasUpdate,
    setShowUpdateModal,
    handleUpdate,
    forceUpdate
  } = useVersionCheck();

  useEffect(() => {
    // Блокируем кнопку назад при необходимости обновления
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (hasUpdate) {
        Alert.alert(
          'Требуется обновление',
          'Вы не можете использовать приложение без обновления. Пожалуйста, обновите приложение.',
          [{ text: 'Понятно', style: 'cancel' }]
        );
        return true;
      }
      return false;
    });

    // Если обновление не требуется и версия сервера получена, переходим на главный экран
    if (!hasUpdate && serverVersion) {
      router.replace('/(tabs)');
    }

    return () => {
      backHandler.remove();
    };
  }, [hasUpdate, serverVersion]);

  // Если требуется принудительное обновление, показываем модальное окно
  useEffect(() => {
    if (forceUpdate) {
      setShowUpdateModal(true);
    }
  }, [forceUpdate]);

  return (
    <View style={styles.container}>
      {/* Фоновое изображение */}
      <View style={styles.backgroundContainer}>
        <Image 
          source={require('@/assets/images/bg.webp')}
          style={styles.backgroundImage}
          contentFit="cover"
          transition={0}
          cachePolicy="memory-disk"
        />
      </View>
      
      {/* Логотип */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/grek.webp')}
          style={styles.logo}
          contentFit="contain"
        />
      </View>
      
      {/* Версия приложения */}
      <Text style={styles.versionText}>v{version}</Text>

      {/* Модальное окно обновления */}
      <UpdateModal 
        visible={showUpdateModal} 
        onUpdate={handleUpdate}
        serverVersion={serverVersion}
      />
    </View>
  );
};

// Стили компонента
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  backgroundContainer: {
    position: 'absolute',
    width: width * 1.2,
    height: height *1.1,
    top: 0,
    left: 0,
    transform: [{ translateX: -width * 0.2 }],
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 300,
    height: 300,
  },
  versionText: {
    position: 'absolute',
    bottom: 40,
    color: Colors.white,
    ...TextStyles.text,
    textAlign: 'center',
  },
}); 