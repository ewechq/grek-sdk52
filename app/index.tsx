import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Text, Dimensions, Modal, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors, TextStyles } from '@/theme';
import Btn from '@/components/ui/btns/Btn';

const { width, height } = Dimensions.get('window');

const CURRENT_VERSION = "0.6.6";

export default function SplashScreen() {
  const router = useRouter();
  const rotateAnim = new Animated.Value(0);
  const progressAnim = new Animated.Value(0);
  const [version, setVersion] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [serverVersion, setServerVersion] = useState('');
  const [isUpdated, setIsUpdated] = useState(false);

  const checkVersion = (serverVer: string) => {
    setServerVersion(serverVer);
    if (serverVer !== CURRENT_VERSION && !isUpdated) {
      setShowUpdateModal(true);
      return false;
    }
    return true;
  };

  // Имитация обновления
  const handleUpdate = () => {
    setVersion(serverVersion);
    setIsUpdated(true);
    setShowUpdateModal(false);
  };

  useEffect(() => {
    // Получение версии
    fetch('https://api.grekland.ru/api/version')
      .then(response => response.json())
      .then(data => {
        const serverVer = data.Version || '';
        setVersion(isUpdated ? serverVer : CURRENT_VERSION);
        checkVersion(serverVer);
      })
      .catch(error => {
        console.error('Error fetching version:', error);
      });

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

    const timer = setTimeout(() => {
      if (!showUpdateModal) {
        router.replace('/(tabs)');
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isUpdated]);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-20deg', '0deg', '20deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.backgroundContainer}>
        <Image 
          source={require('@/assets/images/bg-light.webp')}
          style={styles.backgroundImage}
          contentFit="cover"
          transition={0}
          cachePolicy="memory-disk"
        />
      </View>
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
      <Text style={styles.versionText}>v{version}</Text>

      <Modal
        visible={showUpdateModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Доступна новая версия приложения</Text>
            <Text style={styles.modalText}>
            Добавили новый функционал, чтобы радовать вас еще больше!
            </Text>
            <Btn
              title="Обновить"
              onPress={handleUpdate}
              bgColor={Colors.pink}
              textColor={Colors.black}
            />
            
          </View>
        </View>
      </Modal>
    </View>
  );
}

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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding:16,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    ...TextStyles.h2,
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalText: {
    ...TextStyles.text,
    color: Colors.grayText,
    textAlign: 'center',
    marginBottom: 24,
  },

}); 