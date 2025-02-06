import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { TextStyles, Colors } from '@/theme';
import { Entypo } from '@expo/vector-icons';

// Включаем LayoutAnimation для Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion = ({ title, children }: AccordionProps) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[
          styles.header, 
          expanded && styles.headerActive
        ]} 
        onPress={toggleExpand}
      >
        <Text style={styles.title}>{title}</Text>
        <Entypo 
          name="chevron-thin-down" 
          size={12} 
          color={Colors.grayText}
          style={[
            styles.arrow,
            expanded && styles.arrowActive
          ]} 
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayBg,
    height: 40,  
  },
  headerActive: {
    borderBottomColor: Colors.purple,
  },
  title: {
    ...TextStyles.text,
    color: Colors.black,
    flex: 1,
  },
  arrow: {
    transform: [{ rotate: '0deg' }],
    color: Colors.grayText,
  },
  arrowActive: {
    transform: [{ rotate: '180deg' }],
    color: Colors.purple,
  },
  content: {
    padding: 8,
    paddingTop: 8,
    ...TextStyles.textDescription,
    color: Colors.grayText,
  },
});

export default Accordion; 