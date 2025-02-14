import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { TextStyles, Colors } from "@/theme"

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
        TextStyles.h2,
        { color: textColor },
        disabled && styles.disabledText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default Btn

const styles = StyleSheet.create({
  button: {
    height: 40,
    paddingHorizontal: 40,
    borderRadius: 40,
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
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    color: Colors.grayText,
  }
})
