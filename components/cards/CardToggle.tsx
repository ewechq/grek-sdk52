import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, TextStyles } from '@/theme';
import BtnDownlineText from '@/components/btns/BtnDownlineText';

interface CardToggleProps {
  title: string;
  isActive: boolean;
  onToggle: () => void;
  onInfoPress?: () => void;
  style?: object;
  activeCardColor?: string;      
  switchColor?: string;          
  switchCircleColor?: string;    
  titleColor?: string;           
  activeTitleColor?: string;     
  infoButtonColor?: string;      
  activeInfoButtonColor?: string; // цвет кнопки "Что это?" в активном состоянии
}

const CardToggle: React.FC<CardToggleProps> = ({
  title,
  isActive,
  onToggle,
  onInfoPress,
  style,
  activeCardColor = Colors.pink,
  switchColor = Colors.white,
  switchCircleColor = Colors.pink,
  titleColor = Colors.black,
  activeTitleColor = Colors.black,
  infoButtonColor = Colors.black,
  activeInfoButtonColor = Colors.black, // дефолтное значение
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        isActive && [styles.activeCard, { backgroundColor: activeCardColor }],
        style,
      ]}
      onPress={onToggle}
    >
      <View style={styles.content}>
        <View>
          <Text style={[
            styles.title,
            { color: titleColor },
            isActive && { color: activeTitleColor }
          ]}>
            {title}
          </Text>
          <BtnDownlineText
            title="Что это?"
            onPress={onInfoPress || (() => {})}
            color={isActive ? activeInfoButtonColor : infoButtonColor}
            align="left"
          />
          <View style={[
            styles.switch,
            isActive ? [styles.activeSwitch, { backgroundColor: switchColor }] : styles.inactiveSwitch
          ]}>
            <View style={[
              styles.switchCircle,
              isActive ? [styles.activeSwitchCircle, { backgroundColor: switchCircleColor }] : styles.inactiveSwitchCircle,
              { transform: [{ translateX: isActive ? 20 : 0 }] }
            ]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.grayBg,
    borderRadius: 25,
    padding: 16,
    minHeight: 140,
  },
  activeCard: {
    // удаляем фиксированный цвет, так как он теперь приходит через пропсы
  },
  content: {
    flexDirection: 'column',
  },
  title: {
    ...TextStyles.h3,
    marginBottom: 5,
    // удаляем фиксированный цвет
  },
  activeText: {
    // удаляем фиксированный цвет
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    marginTop: 8,
  },
  activeSwitch: {
    backgroundColor: Colors.white,
  },
  inactiveSwitch: {
    backgroundColor: Colors.grayElements,
  },
  switchCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  activeSwitchCircle: {
    backgroundColor: Colors.pink,
  },
  inactiveSwitchCircle: {
    backgroundColor: Colors.white,
  },
});

export default CardToggle; 