import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Colors } from '@/theme';

const TAB_HEIGHT = 70;
const { width } = Dimensions.get('window');
const tabWidth = 220;

export default function TabShape() {
  const d = `
    M 0 30
    Q 0 0 30 0
    H ${tabWidth / 2 - 60}
    C ${tabWidth / 2 - 20} 0, ${tabWidth / 2 - 55} 50, ${tabWidth / 2} 50
    C ${tabWidth / 2 + 55} 50, ${tabWidth / 2 + 20} 0, ${tabWidth / 2 + 60} 0
    H ${tabWidth - 30}
    Q ${tabWidth} 0 ${tabWidth} 30
    V ${TAB_HEIGHT - 30}
    Q ${tabWidth} ${TAB_HEIGHT} ${tabWidth - 30} ${TAB_HEIGHT}
    H 30
    Q 0 ${TAB_HEIGHT} 0 ${TAB_HEIGHT - 30}
    Z
  `;

  return (
    <Svg width={tabWidth} height={TAB_HEIGHT}>
      <Defs>
        <LinearGradient id="innerShadow" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={Colors.purple} stopOpacity="0" />
          <Stop offset="1" stopColor="rgba(116, 112, 226, 0.1)" stopOpacity="0.3" />
        </LinearGradient>
      </Defs>
      <Path fill={Colors.purple} d={d} />
      <Path 
        d={d} 
        fill="url(#innerShadow)"
      />
    </Svg>
  );
} 