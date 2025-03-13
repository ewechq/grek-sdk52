import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from '@/theme';
import TabBar from '@/components/ui/layout/TabBar';
import { Ionicons } from '@expo/vector-icons';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  size?: number;
  }) {
  return <Ionicons size={props.size || 24} name={props.name} color={Colors.white} />;
  }
  
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
            title: 'Новости',
            tabBarIcon: (props) => (
              <TabBarIcon 
                {...props} 
                name={props.focused ? "home" : "home-outline"} 
              />
            )
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: 'Главная',
            tabBarIcon: (props) => (
              <TabBarIcon 
                {...props} 
                name={props.focused ? "add-circle" : "add-circle-outline"} 
              />
            )
          }}
        />
        <Tabs.Screen
          name="mc"
          options={{
            title: 'MC',
            tabBarIcon: (props) => (
              <TabBarIcon 
                {...props} 
                name={props.focused ? "balloon" : "balloon-outline"} 
              />
            )
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