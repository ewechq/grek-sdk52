import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, TextStyles } from '@/theme';
import Btn  from '@/components/ui/btns/Btn';

const SuccessScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.push('/(tabs)');
  };

  return (
    <View style={styles.container}>
    <Image source={require('@/assets/images/grek_vesna.png')} style={styles.image} />
    <View style={styles.containerText}>
      
      <Text style={styles.title}>Билеты летят к вам на почту! 🦖🚀</Text>
      <Text style={styles.message}>А Грек уже ждет на входе! Добро пожаловать в мир веселья и счастья!  </Text>
      <View style={styles.buttonContainer}>
        <Btn 
          title="Назад"
          onPress={handleBackPress}
          bgColor={Colors.pink}
        />
      </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    backgroundColor: Colors.white,
  },
  containerText: {
    
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
  },
  title: {
    ...TextStyles.h2,
    color: Colors.black,
    marginBottom: 4,
    textAlign: 'center',
  },
  message: {
    ...TextStyles.text,
    color: Colors.black,
    marginBottom: 32,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
  },
  image:{
    width: 350,
    height:350,
    marginBottom: 16,
  }
});

export default SuccessScreen; 