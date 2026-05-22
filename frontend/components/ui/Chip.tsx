import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { C } from '../../constants/theme';

type Variant = 'neutral' | 'primary' | 'positive' | 'warning' | 'negative' | 'outline';
type Size = 'xs' | 'sm' | 'md';

const variants: Record<Variant, { bg: string; color: string; borderColor?: string }> = {
  neutral: { bg: C.bg3, color: C.text2 },
  primary: { bg: C.blueLow, color: C.blue },
  positive: { bg: C.greenLow, color: C.green },
  warning: { bg: C.yellowLow, color: '#D17600' },
  negative: { bg: C.redLow, color: C.red },
  outline: { bg: '#fff', color: C.text2, borderColor: C.line },
};

const heights: Record<Size, number> = { xs: 22, sm: 26, md: 30 };
const fontSizes: Record<Size, number> = { xs: 11, sm: 12, md: 13 };

interface Props {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  style?: ViewStyle;
}

export function Chip({ children, variant = 'neutral', size = 'sm', style }: Props) {
  const v = variants[variant];
  return (
    <View
      style={[
        styles.chip,
        {
          height: heights[size],
          backgroundColor: v.bg,
          borderWidth: v.borderColor ? 1 : 0,
          borderColor: v.borderColor,
        },
        style,
      ]}
    >
      <Text style={[styles.label, { fontSize: fontSizes[size], color: v.color }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  label: {
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
