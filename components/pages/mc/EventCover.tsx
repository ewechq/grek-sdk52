/**
 * Компонент обложки для страницы мастер-класса /mc/[id]
 * Отображает:
 * - Изображение мастер-класса
 * - Возрастное ограничение в правом верхнем углу
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { TextStyles, Colors } from '@/theme';

interface EventCoverProps {
  cover: string | null;
  ageLimit: number;
}

export const EventCover: React.FC<EventCoverProps> = ({ cover, ageLimit }) => {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: cover || undefined }}
        contentFit="cover"
      />
      <View style={styles.ageLimitContainer}>
        <Text style={styles.ageLimit}>{ageLimit}+</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 15,
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    alignSelf: 'center',
    borderRadius: 25,
  },
  ageLimitContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 50,
    height: 50,
    backgroundColor: Colors.white,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageLimit: {
    ...TextStyles.h2,
    color: Colors.purple,
  },
}); 