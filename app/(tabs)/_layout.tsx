import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from '@/theme';
import TabBar from '@/components/ui/layout/TabBar';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={props => <TabBar {...props} />}
      >
        <Tabs.Screen
          name="news"
          options={{
            title: 'Новости'
          }}
        />
        <Tabs.Screen
          name="mc"
          options={{
            title: 'MC'
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Главная'
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