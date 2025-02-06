import { Tabs } from 'expo-router';
import React from 'react';
import {  StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons  } from '@expo/vector-icons';
import { Colors } from '@/theme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  size?: number;
  }) {
  return <Ionicons size={props.size || 24} name={props.name} color={props.color} />;
  }

export default function TabLayout() {

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
         tabBarActiveTintColor: Colors.purple,
         tabBarInactiveTintColor: Colors.grayElements,
         tabBarStyle: {
            borderRadius: 40,
            paddingHorizontal: 16,
            height: 50,
            marginHorizontal:16,
            shadowColor: '#96969605',
            borderWidth: 0,
            backgroundColor: Colors.white,
            position: 'absolute',
            bottom: 30,
            borderTopWidth: 0,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 8
         },
         headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Главная',
          tabBarIcon(props) {
            return <TabBarIcon {...props} name="rocket" />;
          },
        }}
      />
      <Tabs.Screen
        name="news"
        options={{
          title: 'Новости',
          tabBarIcon(props) {
            return <TabBarIcon {...props} name="rocket" />;
          },
        }}
      />
      <Tabs.Screen
        name="mc"
        options={{
          title: 'MC',
          tabBarIcon(props) {
            return <TabBarIcon {...props} name="rocket" />;
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Профиль',
          tabBarIcon(props) {
            return <TabBarIcon {...props} name="rocket" />;
          },
        }}
      />

    </Tabs>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
      flex: 1,
      backgroundColor: Colors.white,
      
  },
  
  });