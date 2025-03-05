import { StyleSheet } from 'react-native';

const shallowEqualArrays = (arrA: unknown[], arrB: unknown[]): boolean => {
  if (arrA === arrB) return true;
  if (!arrA || !arrB) return false;
  if (arrA.length !== arrB.length) return false;
  
  for (let i = 0; i < arrA.length; i++) {
    if (arrA[i] !== arrB[i]) return false;
  }
  return true;
};

export const memoizeStyles = <
  A extends unknown[],
  S extends StyleSheet.NamedStyles<S>
>(
  styleCreator: (...args: A) => S
) => {
  let lastArgs: A;
  let style: S;
  
  return (...args: A) => {
    if (!style || !shallowEqualArrays(args, lastArgs)) {
      style = StyleSheet.create(styleCreator(...args));
      lastArgs = args;
    }
    return style;
  };
}; 