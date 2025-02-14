import React, { useState, useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Animated } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { TextStyles, Colors } from "@/theme";

interface ListComponentProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  highlightColor: string;
  showCounter?: boolean;
}

const ScrollableList = ({
  backgroundColor = Colors.grayBg,
  itemBackgroundColor = 'transparent',
  activeItemBackgroundColor = Colors.purple,
  titleColor = Colors.black,
  activeTitleColor = Colors.black,
  subtitleColor = Colors.grayText,
  activeSubtitleColor = Colors.black,
  counterColor = Colors.black,
  counterButtonColor = Colors.black,
  showCounter = true,
}: {
  backgroundColor?: string;
  itemBackgroundColor?: string;
  activeItemBackgroundColor?: string;
  titleColor?: string;
  activeTitleColor?: string;
  subtitleColor?: string;
  activeSubtitleColor?: string;
  counterColor?: string;
  counterButtonColor?: string;
  showCounter?: boolean;
}) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [counters, setCounters] = useState<{ [key: number]: number }>({});
  const scrollY = useRef(new Animated.Value(0)).current;

  const data = [
    { id: 1, title: "Стол №1, 2 этаж", deposit: 5000, seats: 4 },
    { id: 2, title: "Стол №2, 2 этаж", deposit: 8000, seats: 6 },
    { id: 3, title: "Стол №3, 2 этаж", deposit: 4000, seats: 4 },
    { id: 4, title: "Стол №4, 2 этаж", deposit: 7000, seats: 6 },
    { id: 5, title: "Стол №5, 2 этаж", deposit: 16000, seats: 16 },
    { id: 6, title: "Стол №6, 2 этаж", deposit: 13000, seats: 8 },
    { id: 7, title: "Стол №7, 2 этаж", deposit: 8000, seats: 6 },
  ];

  const handleIncrease = (id: number) => {
    setCounters(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleDecrease = (id: number) => {
    const newValue = Math.max(0, (counters[id] || 1) - 1);
    setCounters(prev => ({
      ...prev,
      [id]: newValue
    }));

    if (newValue === 0) {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
      setCounters(prev => {
        const newCounters = { ...prev };
        delete newCounters[id];
        return newCounters;
      });
    }
  };

  const handleSelect = (id: number) => {
    if (selectedItems.includes(id)) {
      handleDecrease(id);
    } else {
      setSelectedItems(prev => [...prev, id]);
      setCounters(prev => ({
        ...prev,
        [id]: 1
      }));
    }
  };

  const renderItem = ({ item }: { item: typeof data[0] }) => {
    const isSelected = selectedItems.includes(item.id);
    return (
      <TouchableOpacity
        onPress={() => handleSelect(item.id)}
        style={[
          styles.item,
          {
            backgroundColor: isSelected
              ? activeItemBackgroundColor
              : itemBackgroundColor,
            paddingBottom: isSelected && showCounter ? 0 : 20,
            borderRadius: 25,
          },
        ]}
      >
        <View>
          <Text
            style={{
              ...TextStyles.text,
              color: isSelected ? activeTitleColor : titleColor,
            }}
          >
            {item.title}
          </Text>
          <Text
            style={{
              ...TextStyles.textDescription,
              color: isSelected ? activeSubtitleColor : subtitleColor,
            }}
          >
            Депозит: {item.deposit}, кол-во мест: {item.seats}
          </Text>
        </View>
        {isSelected && showCounter && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              height: 40,
              gap: 8,
            }}
          >
            <TouchableOpacity onPress={() => handleDecrease(item.id)} style={{paddingRight:16, paddingVertical:8, }}>
              <AntDesign name="minus" size={16} color={counterButtonColor} />
            </TouchableOpacity>
            <Text style={{ fontSize: 14, color: counterColor }}>
              {counters[item.id] || 1}
            </Text>
            <TouchableOpacity onPress={() => handleIncrease(item.id)} style={{paddingHorizontal:16, paddingVertical:8}}>
              <AntDesign name="plus" size={16} color={counterButtonColor} />
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        nestedScrollEnabled={true}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={true}
        indicatorStyle="black"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    borderRadius: 25,
    marginHorizontal: 0,
    height: 280,
    paddingRight: 8,
    paddingVertical: 16,
  },
  listContent: {
    paddingTop: 0,
    paddingBottom: 16,
  },
  item: {
    paddingVertical: 16,
    paddingLeft: 16,
    marginRight: 16,
    borderRadius: 25,
  },
});

export default ScrollableList;
