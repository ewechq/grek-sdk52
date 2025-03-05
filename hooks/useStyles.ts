import { useWindowDimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import { memoizeStyles } from '@/utils/memoizeStyles';

export const makeUseStyles = <S extends StyleSheet.NamedStyles<S>>(
  styleCreator: (isSmallLayout: boolean) => S
) => {
  const getStyles = memoizeStyles(styleCreator);
  
  return () => {
    const { width } = useWindowDimensions();
    const isSmallLayout = width < 375;
    return [getStyles(isSmallLayout), isSmallLayout] as const;
  };
}; 