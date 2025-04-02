/**
 * Виджет загрузочного экрана приложения
 * 
 * Функциональность:
 * 1. Отображает анимированный логотип
 * 2. Проверяет наличие обновлений приложения
 * 3. Показывает модальное окно обновления при необходимости
 * 4. Автоматически перенаправляет на главный экран через 5 секунд
 * 
 * Особенности:
 * - Блокирует кнопку "назад" при наличии обязательного обновления
 * - Использует анимацию вращения для логотипа
 * - Кэширует фоновое изображение
 * - Отображает текущую версию приложения
 */

import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Text, Dimensions, BackHandler, Alert } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors, TextStyles } from '@/theme';
import { useVersionCheck } from '@/hooks/version/useVersionCheck';
import { useRotationAnimation } from '@/hooks/animations/useRotationAnimation';
import { UpdateModal } from '@/components/ui/modals/UpdateModal';

const { width, height } = Dimensions.get('window');

export const SplashScreenWidget = () => {
  // Хук для навигации
  const router = useRouter();
  // Хук для анимации вращения логотипа
  const { rotate } = useRotationAnimation();
  // Хук для проверки обновлений
  const {
    version,
    showUpdateModal,
    setShowUpdateModal,
    handleUpdate,
    checkForUpdate,
    serverVersion,
    hasUpdate
  } = useVersionCheck();

  useEffect(() => {
    // Проверяем обновления при запуске экрана
    checkForUpdate();
    
    // Блокируем навигацию назад только если есть окно обновления и действительно требуется обновление
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showUpdateModal && hasUpdate) {
        Alert.alert(
          'Требуется обновление',
          'Вы не можете использовать приложение без обновления.',
          [{ text: 'Понятно', style: 'cancel' }]
        );
        return true; // Предотвращаем выход из приложения
      }
      return false;
    });
    
    // Таймер для перехода на главный экран, если нет модального окна обновления
    const timer = setTimeout(() => {
      if (!showUpdateModal) {
        router.replace('/(tabs)');
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      backHandler.remove();
    };
  }, [showUpdateModal, hasUpdate, router, checkForUpdate]);

  return (
    <View style={styles.container}>
      {/* Фоновое изображение */}
      <View style={styles.backgroundContainer}>
        <Image 
          source={require('@/assets/images/bg-light.webp')}
          style={styles.backgroundImage}
          contentFit="cover"
          transition={0}
          cachePolicy="memory-disk"
        />
      </View>
      
      {/* Анимированный логотип */}
      <Animated.View style={[
        styles.logoContainer,
        { transform: [{ rotate }] }
      ]}>
        <Image
          source={require('@/assets/images/grek.webp')}
          style={styles.logo}
          contentFit="contain"
        />
      </Animated.View>
      
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
    height: height,
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
    color: Colors.grayText,
    ...TextStyles.text,
    textAlign: 'center',
  },
}); 