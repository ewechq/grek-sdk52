/**
 * Виджет изображения новости
 * 
 * Функциональность:
 * 1. Отображение изображения новости
 * 2. Обработка ошибок загрузки
 * 3. Отображение плейсхолдера
 * 4. Оптимизация для разных платформ
 * 
 * Особенности:
 * - Кэширование изображений
 * - Плавная анимация загрузки
 * - Адаптивные размеры
 * - Специальные настройки для Android
 */

import React, { useState } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Colors } from '@/theme';
import { PlaceholderImage } from '@/components/ui/images/PlaceholderImage';

// Определение платформы для специфичных настроек
const IS_ANDROID = Platform.OS === 'android';

/**
 * Пропсы компонента изображения
 */
interface NewsImageProps {
  imageUri: string | null;  // URI изображения
}

export const NewsImage = ({ imageUri }: NewsImageProps) => {
  // Состояния для обработки загрузки и ошибок
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  /**
   * Обработчик ошибки загрузки изображения
   */
  const handleImageError = () => {
    setImageError(true);
    setIsImageLoading(false);
  };

  /**
   * Обработчик успешной загрузки изображения
   */
  const handleImageLoadEnd = () => {
    setIsImageLoading(false);
  };

  return (
    <View style={styles.imageContainer}>
      {/* Условный рендеринг изображения или плейсхолдера */}
      {imageUri && !imageError ? (
        <>
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, !isImageLoading && styles.loadedImage]}
            contentFit="cover"
            transition={IS_ANDROID ? 0 : 200}        // Анимация загрузки только для iOS
            cachePolicy="memory-disk"                // Кэширование в памяти и на диске
            priority={IS_ANDROID ? "high" : "normal"} // Высокий приоритет для Android
            onError={handleImageError}
            onLoadEnd={handleImageLoadEnd}
          />
          {/* Плейсхолдер во время загрузки */}
          {isImageLoading && <PlaceholderImage style={StyleSheet.absoluteFill} />}
        </>
      ) : (
        <PlaceholderImage style={styles.image} />
      )}
    </View>
  );
};

// Стили компонента
const styles = StyleSheet.create({
  imageContainer: {
    width: "90%",
    height: undefined,
    aspectRatio: 1,           // Квадратная форма
    backgroundColor: Colors.grayBg,
    borderRadius: 40,         // Скругленные углы
    alignSelf: 'center',
    marginVertical: 16,
    overflow: 'hidden',       // Обрезка выходящего за пределы контента
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loadedImage: {
    opacity: 1,              // Полная прозрачность после загрузки
  },
});