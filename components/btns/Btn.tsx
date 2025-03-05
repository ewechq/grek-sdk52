import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors, TextStyles } from "@/theme"
import { normalize } from '@/utils/responsive';
import { makeUseStyles } from '@/hooks/useStyles';

interface BtnComponentProps {
  title: string
  onPress: () => void
  bgColor?: string
  textColor?: string
  width?: 'default' | 'full'
  useSystemFont?: boolean
  disabled?: boolean
}

const Btn: React.FC<BtnComponentProps> = ({ 
  title, 
  onPress, 
  bgColor = Colors.purple,
  textColor = Colors.white,
  width = 'default',
  useSystemFont = false,
  disabled = false
}) => {
  const [styles, isSmallLayout] = useStyles();

  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: bgColor },
        width === 'full' && styles.fullWidth,
        disabled && styles.disabled
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[
        styles.text,
        { color: textColor },
        useSystemFont && styles.systemFont,
        disabled && styles.disabledText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default Btn

const useStyles = makeUseStyles((isSmallLayout) => ({
  button: {
    height: normalize(45),
    paddingHorizontal: normalize(40),
    borderRadius: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  fullWidth: {
    width: '100%',
    alignSelf: 'stretch',
  },
  text: {
    ...TextStyles.h2,
    textAlign: 'center',
  },
  systemFont: {
    ...TextStyles.text,
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
