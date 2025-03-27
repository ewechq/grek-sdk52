import { StyleSheet, View, ScrollView, Image, Text } from 'react-native'
import React, { useState, useCallback } from 'react'
import { useRouter } from 'expo-router'
import Btn from '@/components/ui/btns/Btn'
import { Colors, TextStyles } from '@/theme/index'
import { normalize } from '@/utils/responsive'
import {DiscountsModal} from '@/components/ui/modals/DiscountsModal'
import { MainTicketCard } from '@/widgets/main/MainTicketCard'

export default function MainScreen() {
  const [isDiscountsModalVisible, setIsDiscountsModalVisible] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const router = useRouter();

  // Мемоизируем функции-обработчики
  const handleLogoError = useCallback(() => {
    setLogoError(true);
    console.warn('Failed to load logo image');
  }, []);

  const handleBuyTicket = useCallback(() => {
    try {
      router.push('/(buyticket)');
    } catch (error) {
      router.push('/');
    }
  }, [router]);

  const handleDiscountsPress = useCallback(() => {
    setIsDiscountsModalVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require('@/assets/images/pattern.webp')} 
        style={styles.backgroundPattern}
      />
      <ScrollView>
        {!logoError ? (
          <Image 
            source={require('@/assets/images/logo-white.webp')} 
            style={styles.logoImage}
            onError={handleLogoError}
          />
        ) : (
          <View style={styles.logoFallback}>
            <Text style={styles.logoFallbackText}>GREK LAND</Text>
          </View>
        )}
        <View style={styles.bottomButtons}>
          <Btn title="Купить билет" onPress={handleBuyTicket} width="full" bgColor={Colors.pink}/>
          <Btn title="Скидки" onPress={handleDiscountsPress} width="full" bgColor={Colors.purpleDark}/>
        </View>
        <View style={styles.topSection}>
          {/* Пустой контейнер для отступа */}
        </View>
        
        <View style={styles.mainContent}>
          <MainTicketCard />
        </View>
        
        <View style={styles.bottomSection}>
          {/* Пустой контейнер для отступа */}
        </View>
      </ScrollView>

      <DiscountsModal 
        isVisible={isDiscountsModalVisible}
        onClose={() => setIsDiscountsModalVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: Colors.purple,
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '110%',
    height: '110%',
    opacity: 0.3
  },

  // Logo styles
  logoImage: {
    width: '50%',
    height: 80,
    alignSelf: 'center',
    marginVertical: normalize(16),
  },

  mainContent: {
    marginHorizontal: normalize(24),
  },

  bottomButtons: {
    gap: normalize(8),
    padding: normalize(24),
  },

  // Bottom section styles
  bottomSection: {
    margin: normalize(24),
    marginBottom: normalize(140),
    marginTop: 0,
    overflow: 'hidden'
  },
  topSection: {
    marginHorizontal: normalize(24),
    paddingTop: 5,
    marginBottom: 0,
    overflow: 'hidden'    
  },

  // Fallback styles
  logoFallback: {
    width: '50%',
    height: 80,
    alignSelf: 'center',
    marginVertical: normalize(16),
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoFallbackText: {
    ...TextStyles.h1,
    color: Colors.white
  },
}); 