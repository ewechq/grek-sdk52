import React from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Colors } from '@/theme';
import TabShape from './TabShape';
import { Ionicons } from '@expo/vector-icons';

const TAB_HEIGHT = 70;
const { width } = Dimensions.get('window');
const tabWidth = 220;

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function TabBar({ state, descriptors, navigation }: TabBarProps) {
  return (
    <View style={styles.container}>
      <TabShape />
      <View style={StyleSheet.absoluteFill}>
        <View style={styles.tabsContainer}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Центральная кнопка
            if (index === 1) {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={onPress}
                  style={[
                    styles.centerButton,
                    isFocused ? styles.centerButtonFocused : styles.centerButtonInactive
                  ]}
                >
                  <View style={styles.centerButtonInner}>
                    <Ionicons
                      name="ticket"
                      size={24}
                      color={Colors.white} 
                    />
                  </View>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                style={styles.tab}
              >
                <View style={[
                  styles.iconContainer,
                  isFocused && styles.activeIconContainer
                ]}>
                  <Ionicons
                    name={options.tabBarIcon({ 
                      color: isFocused ? Colors.white : Colors.grayElements 
                    }).props.name}
                    size={24}
                    color={isFocused ? Colors.white : Colors.grayElements}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    width: tabWidth,
    height: TAB_HEIGHT,
    marginHorizontal: 16,
    alignSelf: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 28,
    backgroundColor: Colors.pink,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
    marginHorizontal: 5,
  },
  centerButtonFocused: {
    backgroundColor: Colors.pink,
  },
  centerButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButtonInactive: {
    backgroundColor:Colors.purple,
  },
  iconContainer: {
    width: 55,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  activeIconContainer: {
    backgroundColor: 'rgb(139, 134, 231)',
    borderRadius: 20,
  },
  centerButtonIcon: {
    color: Colors.purple,
  },
  centerButtonIconFocused: {
    color: Colors.white,
  },
}); 