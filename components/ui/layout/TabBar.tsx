import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '@/theme';
import { LeftIcon } from '../icons/LeftIcon';
import { RightIcon } from '../icons/RightIcon';
import { CenterIcon } from '../icons/CenterIcon';

interface TabBarProps {
  state: {
    index: number;
    routes: { key: string; name: string }[];
  };
  navigation: {
    navigate: (routeName: string) => void;
  };
}

const TabBar: React.FC<TabBarProps> = ({ state, navigation }) => {
  return (
    <View style={styles.root}>
      {/* Левая группа табов */}
      <View style={styles.leftTabs}>
        {[
          { label: 'События', icon: <RightIcon color={state.index === 0 ? Colors.white : Colors.grayText} size={24} /> },
          { label: 'Афиша', icon: <LeftIcon color={state.index === 1 ? Colors.white : Colors.grayText} size={24} /> },
        ].map((tab, idx) => {
          const isFocused = state.index === idx;
          return (
            <TouchableOpacity
              key={tab.label}
              style={[styles.leftTab, isFocused && styles.leftTabActive]}
              onPress={() => navigation.navigate(state.routes[idx].name)}
            >
              {tab.icon}
              <Text style={[styles.leftTabText, isFocused && styles.leftTabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Кнопка Билет */}
      <TouchableOpacity
        style={[
          styles.ticketButton,
          state.index === 2 && styles.ticketButtonActive
        ]}
        onPress={() => navigation.navigate(state.routes[2].name)}
      >
        <CenterIcon color={state.index === 2 ? Colors.white : Colors.grayText} size={28} />
        <Text style={[
          styles.ticketText,
          state.index === 2 && styles.ticketTextActive
        ]}>Билет</Text>
      </TouchableOpacity>
    </View>
  );
}

export default TabBar;

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    width: '100%',
    backgroundColor: 'transparent',
    position:'absolute',
    bottom:40
  },
  leftTabs: {
    flexDirection: 'row',
    backgroundColor: Colors.grayBg,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftTab: {
    flexDirection: 'column',
    justifyContent:'center',
    alignItems: 'center',
    
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  leftTabActive: {
    backgroundColor: Colors.purple,

  },
  leftTabText: {
    //marginLeft: 6,
    color: Colors.grayText,
    ...Typography.small(),
  },
  leftTabTextActive: {
    color: Colors.white,
  },
  ticketButton: {
    backgroundColor: Colors.grayBg,
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',

  },
  ticketButtonActive: {
    backgroundColor: Colors.purple,
  },
  ticketText: {
    color: Colors.grayText,
    ...Typography.small(),
    //marginTop: 2,
  },
  ticketTextActive: {
    color: Colors.white,
  },
});