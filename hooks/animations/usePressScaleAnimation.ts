import { useRef } from "react";
import { Animated } from "react-native";

export function usePressScaleAnimation(
  scaleDown: number = 0.9,
  inDuration: number = 200,
  outDuration: number = 100
) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: scaleDown,
      duration: inDuration,
      useNativeDriver: true,
    }).start();
  };
  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: outDuration,
      useNativeDriver: true,
    }).start();
  };

  return { scale, handlePressIn, handlePressOut };
}