import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { TextStyles, Colors } from "@/theme";

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
    <TouchableOpacity onPress={handlePress} style={[styles.container, {marginTop: marginTop}]}>
      <View style={styles.contentContainer}>
        <View style={{paddingBottom: 10}}>
          <View style={{position: 'absolute', left: 0}}>
            <Ionicons name="chevron-back-outline" size={16} color={iconColor} />
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HeaderInner;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:16,
    width:'100%',
  },
  contentContainer: {
    width: "100%",
  },
  title: {
    ...TextStyles.h2,
    color: Colors.black,
    paddingHorizontal:16,
    textAlign: 'center',
  },
});
