import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Image } from 'react-native'
import React from 'react'
import HeaderInner from "@/components/Header";
import { Colors, TextStyles } from "@/theme";
import ChildCard from '@/components/cards/ChildCard';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useChildren } from '@/hooks/useChildren';

const MyKidsScreen = () => {
  const router = useRouter();
  const { children, loading, error } = useChildren();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.purple} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <ScrollView style={styles.container}>
      <HeaderInner title="О детях" />
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.addCard} 
          onPress={() => router.push("/profile/mykids/(add)")}
        >
          <View style={styles.addContent}>
            <Image source={require('@/assets/images/grekbaby.png')} style={{height: "50%", aspectRatio: 1}} />
            <View style={{flexDirection: "row", gap: 8, }}>
              <Ionicons name="add" size={24} color={Colors.black} />
              <Text style={styles.addText}>Добавить{'\n'}ребенка</Text>
            </View>
          </View>
        </TouchableOpacity>
        {children.map(child => (
          <ChildCard
            key={child.id}
            name={child.name}
            birthDate={formatDate(child.birth_date)}
            photo={require('../../../../assets/images/child-photo-1.png')} // временно используем локальное фото
            isVerified={Boolean(child.agreement)}
          />
        ))}
      </View>
    </ScrollView>
  )
}

export default MyKidsScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16
  },
  content: {
    marginTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    marginBottom:160
  },
  addCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: Colors.yellow,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
  },
  addContent: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    gap: 8,

  },
  addText: {
    ...TextStyles.h3,

    color: Colors.black,
    textAlign: 'left',
    fontSize: 14,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  errorText: {
    ...TextStyles.text,
    color: Colors.pink,
    textAlign: 'center',
    padding: 16,
  },
})