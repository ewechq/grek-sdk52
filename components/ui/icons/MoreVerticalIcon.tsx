import React from "react";
import { Svg, Circle, G } from "react-native-svg";

interface MoreIconProps {
  color?: string;
  size?: number;
}

export const MoreIcon: React.FC<MoreIconProps> = ({
  color = "#fff",
  size = 24,
}) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
    >
      <G fill="none" stroke={color} stroke-width="2">
        <Circle cx="12" cy="4" r="1" transform="rotate(90 12 4)" />
        <Circle cx="12" cy="12" r="1" transform="rotate(90 12 12)" />
        <Circle cx="12" cy="20" r="1" transform="rotate(90 12 20)" />
      </G>
    </Svg>
  );
};
