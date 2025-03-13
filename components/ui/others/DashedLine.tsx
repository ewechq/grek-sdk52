import React from 'react';
import Svg, { Line } from 'react-native-svg';
import { Colors } from '@/theme';

const DashedLine = () => {
  return (
    <Svg height="2" width="75%" style={{alignSelf: 'center'}}>
      <Line
        x1="0"
        y1="1"
        x2="100%"
        y2="1"
        stroke={Colors.purple}
        strokeWidth="4"
        strokeDasharray="10"
      />
    </Svg>
  );
};

export default DashedLine; 