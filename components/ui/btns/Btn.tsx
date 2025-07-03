import {  Text, Pressable, ViewStyle } from 'react-native'
import React from 'react'
import { Colors, Typography } from "@/theme"
import { makeUseStyles } from '@/hooks/useStyles';

interface BtnComponentProps {
  title: string | React.ReactNode
  onPress: () => void
  bgColor?: string
  textColor?: string
  width?: 'default' | 'full' | "icon"
  useSystemFont?: boolean
  disabled?: boolean
  style?: ViewStyle
}

const Btn: React.FC<BtnComponentProps> = ({ 
  title, 
  onPress, 
  bgColor = Colors.purple,
  textColor = Colors.white,
  width = 'default',
  useSystemFont = false,
  disabled = false,
  style
}) => {
  const [styles, isSmallLayout] = useStyles();

  return (
    <Pressable
      style={[
        styles.button, 
        { backgroundColor: bgColor },
        width === 'full' && styles.fullWidth,
        width === 'icon' && styles.iconWidth,
        disabled && styles.disabled,
        style
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      {typeof title === 'string' ? (
        <Text style={[
          styles.text,
          { color: textColor },
          useSystemFont && styles.systemFont,
          disabled && styles.disabledText
        ]}>
          {title}
        </Text>
      ) : (
        title
      )}
    </Pressable>
  )
}

export default Btn

const useStyles = makeUseStyles((isSmallLayout) => ({
  button: {
    height: 45,
    paddingHorizontal: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  fullWidth: {
    width: '100%',
    alignSelf: 'stretch',
  },
  iconWidth:{
    width: 45,
    paddingHorizontal: 0,
  },
  text: {
    ...Typography.h3(),
    textAlign: 'center',
  },
  systemFont: {
    ...Typography.small(),
    fontWeight: '400',
    textTransform: 'capitalize' as const,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: Colors.grayText,
  }
}));
