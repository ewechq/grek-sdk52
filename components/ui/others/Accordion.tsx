import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolate 
} from 'react-native-reanimated';
import { Colors, Typography } from "@/theme";
import Ionicons from "@expo/vector-icons/Ionicons";

interface AccordionProps {
  title: string;
  children: React.ReactNode; 
  defaultExpanded?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  title = 'Title Accordion', 
  children,
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  
  const animatedRotation = useSharedValue(defaultExpanded ? 1 : 0);

  const toggleAccordion = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    
    animatedRotation.value = withTiming(newState ? 1 : 0, { duration: 300 });
  };

  const animatedIconStyle = useAnimatedStyle(() => {
    const rotation = interpolate(animatedRotation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotate: `${rotation}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <Pressable style={styles.titleBlock} onPress={toggleAccordion}>
        <Text style={styles.title}>{title}</Text>
        <Animated.View style={animatedIconStyle}>
          <Ionicons name="chevron-down-outline" size={16} color={Colors.black} />
        </Animated.View>
      </Pressable>
      
      {isExpanded && (
        <View style={styles.contentContainer}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  titleBlock: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  title: {
    ...Typography.h2(),
    color: Colors.black,
    flex: 1,
  },
  contentContainer: {
    overflow: 'hidden',
    paddingTop: 8,
  },
});