import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { Typography, Colors } from "@/theme";

interface HeaderInnerProps {
  title: string;
  textColor?: string;
  iconColor?: string;
  iconBgColor?: string;
  marginTop?: number;
  onPress?: () => void;
}

const HeaderInner: React.FC<HeaderInnerProps> = ({
  title,
  textColor = Colors.black,
  iconColor = Colors.grayText,
  marginTop = 16,
  onPress,
}) => {
  const router = useRouter();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <Pressable onPress={handlePress} style={[styles.container, {marginTop: marginTop}]}>
      <View style={styles.contentContainer}>
        <View style={{justifyContent:'center'}}>
          <View style={{position: 'absolute', left: 0}}>
            <Ionicons name="chevron-back-outline" size={16} color={iconColor} />
          </View>
          <Text style={[styles.title, { color: textColor}]}>{title}</Text>
        </View>
      </View>
    </Pressable>
  );
};

export default HeaderInner;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:16,
    paddingBottom:16,
    width:'100%',

  },
  contentContainer: {
    width: "100%",
  },
  title: {
    ...Typography.h3("Medium"),
    textTransform: 'uppercase',
    paddingHorizontal:16,
    textAlign: 'center',
    alignSelf: 'center',
    
  },
});
