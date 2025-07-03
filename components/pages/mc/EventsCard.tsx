import React, { useState, useRef } from "react";
import { Animated, StyleSheet, View, Text, ImageSourcePropType, Pressable } from "react-native";
import { Image } from "expo-image";
import { Colors, Typography } from "@/theme";
import { useRouter } from "expo-router";
import { usePressScaleAnimation } from "@/hooks/animations/usePressScaleAnimation";

export interface ChildComponentProps {
  id: number;
  title: string;
  cover: ImageSourcePropType;
  price?: number;
  time?: string;
  ageLimit?: number;
}

const CardComponent: React.FC<ChildComponentProps> = ({
  id,
  title,
  cover,
  price,
  time,
  ageLimit
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  const { scale, handlePressIn, handlePressOut } = usePressScaleAnimation();

  const handlePress = () => {
    router.push(`/mc/${id}`);
  };

  return (
    <Pressable onPress={handlePress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={[styles.mainView, { transform: [{ scale }] }]}>
        <Image
          style={[styles.imgCard, !isLoaded && styles.imgPlaceholder]}
          source={cover}
          onLoad={() => setIsLoaded(true)}
        />
        {title && (
          <Text 
            style={styles.textHeader}
            numberOfLines={2}
            ellipsizeMode="clip"
          >
            {String(title)}
          </Text>
        )}
        <View style={styles.infoContainer}>
          {time && (
            <Text style={styles.timeText}>
              {String(time)}
            </Text>
          )}
          {price !== undefined && price !== null && (
            <Text style={styles.priceText}>
              {String(price)} ₽
            </Text>
          )}
        </View>
        {ageLimit !== undefined && ageLimit !== null && (
          <Text style={styles.ageLimitText}>
            {String(ageLimit)}+
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  mainView: {
    width: "100%",
    height: 240,
  },
  imgCard: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 20,
  },
  imgPlaceholder: {
    backgroundColor: Colors.grayBg,
  },
  textHeader: {
    paddingTop: 8,
    ...Typography.h3(),
    color: Colors.black,
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    justifyContent: 'space-between',
  },
  timeText: {
    ...Typography.small(),
    paddingVertical: 4,
    color: Colors.grayText,
  },
  priceText: {
    ...Typography.small(),
    paddingVertical: 4,
    paddingLeft: 16,
    color: Colors.grayText,
  },
  ageLimitText: {
    position: 'absolute',
    top: 4,
    right: 6,
    backgroundColor: Colors.white,
    borderRadius: 25,
    ...Typography.small(),
    width: 30,
    height: 30,
    color: Colors.grayText,
    textAlign: 'center',
    textAlignVertical: 'center',
    lineHeight: 20,
    paddingTop: 0,
  },

});

export default CardComponent;


