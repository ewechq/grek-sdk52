import React, { useState } from "react";
import { StyleSheet, Image, Text, Pressable, View,  Animated  } from "react-native";
import Octicons from "@expo/vector-icons/Octicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from '@expo/vector-icons/Entypo'
import { Colors, Typography } from "@/theme/index";
import { usePressScaleAnimation } from "@/hooks/animations/usePressScaleAnimation";
import {SunIcon} from '@/components/ui/icons/SunIcon'
import {PhoneIcon} from '@/components/ui/icons/PhoneIcon'
import { useTheme } from '@/theme';

interface MainHeaderProps {
  colorPark?:string,
  colorEditPark?:string,
  colorIconTheme?:string,
  colorIconContact?:string
}

const PARKS = [
  "Grek Land",
  "Троя Парк",
  "Юкка Парк",
  "Софи в стране чудес"
];

const MainHeader: React.FC<MainHeaderProps> = (
  {
    colorEditPark=Colors.grayText, 
    colorIconContact=Colors.grayText, 
    colorIconTheme=Colors.grayText, 
    colorPark=Colors.black
  }) => {
  const [selectedPark, setSelectedPark] = useState(PARKS[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scale, handlePressIn, handlePressOut } = usePressScaleAnimation();
  const { theme, toggleTheme, colors } = useTheme();

  const handleSelect = (park: string) => {
    setSelectedPark(park);
    setMenuOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <Image
          source={require("@/assets/images/icon2.png")}
          style={styles.image}
        />
        <View style={{ position: 'relative' }}>
        
          <Pressable onPress={() => setMenuOpen((v) => !v)} onPressIn={handlePressIn} onPressOut={handlePressOut}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Text style={[styles.parkName, {color:colors.text}]}>{selectedPark}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Entypo name="chevron-thin-down" size={10} color={colors.text} style={{ marginTop: 2 }} />
              <Text style={[styles.changePark, {color:colors.text}]}>Изменить парк</Text>
            </View>
            </Animated.View>
          </Pressable>
          {menuOpen && (
            <View style={styles.dropdownMenu}>
              {PARKS.filter(p => p !== selectedPark).map((park) => (
                <Pressable key={park} onPress={() => handleSelect(park)} style={styles.dropdownItem}>
                  <Text style={styles.dropdownText}>{park}</Text>
                </Pressable>
              ))}
            </View>
          )}
          
        </View>
      </View>
      <View style={styles.right}>
        <Pressable style={styles.iconBtn} onPress={toggleTheme} onPressIn={handlePressIn} onPressOut={handlePressOut}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <SunIcon color={colors.text} size={18}/>
        </Animated.View>
        </Pressable>
        <Pressable style={styles.iconBtn}>
          <PhoneIcon  color={colors.text} size={18}/>
        </Pressable>
      </View>
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop:32,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  parkName: {
    ...Typography.caption()
  },
  changePark: {
    ...Typography.small(),
  },
  iconBtn: {
    padding: 10,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 45,
    left: -16,
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth:0.5,
    borderColor:Colors.grayElements,
    zIndex: 100,
    minWidth: 180,
    paddingVertical: 4,
    paddingHorizontal: 16,
  },
  dropdownItem: {
    paddingVertical: 10,
    //paddingHorizontal: 16,
  },
  dropdownText: {
    ...Typography.caption(),
    color: Colors.black,
  },
});
