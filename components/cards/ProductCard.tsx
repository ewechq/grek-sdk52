import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextStyles, Colors } from "@/theme";
import AntDesign from '@expo/vector-icons/AntDesign';

interface ProductCardProps {
  image: any;
  title: string;
  description: string;
  onPress?: () => void;
  addButtonColor?: string;
  addIconColor?: string;
  counterColor?: string;
  counterIconColor?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  title,
  description,
  onPress,
  addButtonColor = Colors.pink,
  addIconColor = Colors.black,
  counterColor = Colors.pink,
  counterIconColor = Colors.black,
}) => {
  const [count, setCount] = useState(0);

  const handleIncrease = () => setCount((prev) => prev + 1);
  const handleDecrease = () => setCount((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {count === 0 && (
          <TouchableOpacity
            onPress={handleIncrease}
            style={[styles.addButton, { backgroundColor: addButtonColor }]}
          >
            <AntDesign name="plus" size={16} color={addIconColor} />
          </TouchableOpacity>
        )}
        <Image
          style={styles.image}
          source={image}
        />
        {count > 0 && (
          <View style={styles.overlay}>
            <View style={[styles.counter, { backgroundColor: counterColor }]}>
              <TouchableOpacity 
                onPress={handleDecrease} 
                style={styles.counterButton}
              >
                <AntDesign name="minus" size={16} color={counterIconColor} />
              </TouchableOpacity>
              <View style={styles.counterTextContainer}>
                <Text style={[styles.counterText, { color: counterIconColor }]}>
                  {count}
                </Text>
              </View>
              <TouchableOpacity 
                onPress={handleIncrease} 
                style={styles.counterButton}
              >
                <AntDesign name="plus" size={16} color={counterIconColor} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text 
        style={styles.description}
        numberOfLines={3}
        ellipsizeMode="tail"
      >
        {description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
  },
  imageContainer: {
    width: 180,
    height: 180,
    borderRadius: 25,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  addButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 1,
    width: 40,
    height: 40,
    borderBottomLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 25,
    width: 120,
    height: 40,
  },
  counterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    ...TextStyles.h2,
  },
  title: {
    ...TextStyles.h3,
    color: Colors.black,
    textAlign: 'center',
    marginTop: 8,
  },
  description: {
    ...TextStyles.textDescription,
    textAlign: 'center',
    marginTop: 4,
    height: 36,
    lineHeight: 12,
    numberOfLines: 3,
    ellipsizeMode: 'tail',
  },
});

export default ProductCard;
