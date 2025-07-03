import React, { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';
import RenderHtml, { MixedStyleDeclaration, RenderHTMLProps } from 'react-native-render-html';
import { Colors, Typography } from '@/theme';

interface RichContentProps {
  html: string;
  baseStyle?: MixedStyleDeclaration;
}

// Переопределяем опции для RenderHtml без использования defaultProps
const renderOptions: Partial<RenderHTMLProps> = {
  enableExperimentalBRCollapsing: true,
  enableExperimentalGhostLinesPrevention: true
};

const RichContent: React.FC<RichContentProps> = ({ 
  html, 
  baseStyle = {} 
}) => {
  const { width } = useWindowDimensions();

  const tagsStyles = useMemo<Record<string, MixedStyleDeclaration>>(() => ({
    heading24: {
      marginBottom: 0,
      paddingBottom: 0,
      textTransform: 'uppercase',
    },
    p: {
      ...Typography.caption(),
    },
    strong: {
      fontWeight: '500' as const,
      fontFamily: 'VelaSans-Regular',
    },
    em: {
      fontStyle: 'italic',
      fontFamily: 'VelaSans-Light',
    },
    ul: {
      marginBottom: 8,
      paddingLeft: 12,
      fontFamily: 'VelaSans-Light',
    },
    li: {
      marginBottom: 4,
      fontFamily: 'VelaSans-Light',
    },
    a: {
      color: Colors.purple,
      textDecorationLine: 'underline',
      fontFamily: 'VelaSans-Light',
    },
    figure: {
      alignItems: 'center',
      marginBottom: 32,
    },
  }), []);

  const classesStyles = useMemo<Record<string, MixedStyleDeclaration>>(() => ({
    'section-title': {
      fontSize: 16,
      fontWeight: '500',
      color: Colors.black,
    },
    'section-content': {
      borderRadius: 25,
    },
    'content-image': {
      width: '100%',
      alignSelf: 'center',
      overflow: 'hidden',
      borderRadius: 25,
    },
    'content-gallery': {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    'info-list': {
      
    },
    'info-item': {
      paddingLeft: 8,
      ...Typography.caption(),
    },
    'info-label': {
    },
  }), []);

  const defaultTextProps = useMemo(() => ({
    selectable: true,
  }), []);

  return (
    <RenderHtml
      contentWidth={width}
      source={{ html }}
      classesStyles={classesStyles}
      baseStyle={baseStyle}
      tagsStyles={tagsStyles}
      defaultTextProps={defaultTextProps}
      {...renderOptions}
    />
  );
};

export default React.memo(RichContent); 