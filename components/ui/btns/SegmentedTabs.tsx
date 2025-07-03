import React from 'react';
import { StyleSheet, Pressable, Text, View } from 'react-native';
import { Typography, Colors } from '@/theme';

interface SegmentedTabsProps {
  tabs: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  activeTextColor?: string;
  defaultTextColor?: string;
}

const SegmentedTabs: React.FC<SegmentedTabsProps> = ({
  tabs = ['Все', 'Новости', 'Акции'],
  selectedIndex = 0,
  onSelect,
  activeTextColor = Colors.black,
  defaultTextColor = Colors.grayText,
}) => {
  return (
    <View style={styles.container}>
      {tabs.map((tab, idx) => (
        <Pressable
          key={tab}
          style={[styles.tab, selectedIndex === idx && { borderBottomWidth: 0.5 }]}
          onPress={() => onSelect(idx)}
        >
          <Text
            style={[
              styles.text,
              { color: selectedIndex === idx ? activeTextColor : defaultTextColor },
            ]}
          >
            {tab}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginBottom:32,
  },
  tab: {
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
  },
  text: {
    ...Typography.caption(),
  },
});

export default SegmentedTabs; 