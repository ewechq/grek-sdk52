import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography } from '@/theme';


interface BtnDownlineTextProps {
  title: string;
  onPress: () => void;
  color?: string;
  align?: 'left' | 'center';
}

const BtnDownlineText: React.FC<BtnDownlineTextProps> = ({
  title,
  onPress,
  color = Colors.black,
  align = 'center',
}) => {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.container,
        { alignItems: align === 'center' ? 'center' : 'flex-start' }
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={[styles.text, { color, textAlign: align }]}>
          {title}
        </Text>
        <View 
          style={[
            styles.underline, 
            { 
              backgroundColor: color,
              alignSelf: align === 'center' ? 'center' : 'flex-start',
            }
          ]} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  textContainer: {
    flexDirection: 'column',
  },
  text: {
    ...Typography.small(),
    marginBottom: 4,
    textDecorationLine: 'underline',
  },
  underline: {
    height: 1,
    width: '100%',
  },
});

export default BtnDownlineText;