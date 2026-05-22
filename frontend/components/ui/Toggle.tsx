import { Pressable, Animated, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import { C } from '../../constants/theme';

interface Props {
  value: boolean;
  onValueChange: (v: boolean) => void;
}

export function Toggle({ value, onValueChange }: Props) {
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [3, 23] });
  const bgColor = anim.interpolate({ inputRange: [0, 1], outputRange: [C.line, C.blue] });

  return (
    <Pressable onPress={() => onValueChange(!value)} style={styles.track}>
      <Animated.View style={[StyleSheet.absoluteFill, styles.trackOverlay, { backgroundColor: bgColor }]} />
      <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 50,
    height: 30,
    borderRadius: 999,
    backgroundColor: C.line,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  trackOverlay: {
    borderRadius: 999,
  },
  thumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
});
