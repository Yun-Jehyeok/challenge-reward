import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { C } from '../../constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'tonal' | 'negative';
type Size = 'lg' | 'md' | 'sm';

interface Props {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  onPress?: () => void;
  disabled?: boolean;
  full?: boolean;
  style?: ViewStyle;
  leading?: ReactNode;
}

const sizes = {
  lg: { height: 52, fontSize: 16, borderRadius: 12, paddingHorizontal: 20 },
  md: { height: 44, fontSize: 15, borderRadius: 10, paddingHorizontal: 16 },
  sm: { height: 36, fontSize: 14, borderRadius: 8, paddingHorizontal: 12 },
};

const variants: Record<Variant, { bg: string; color: string; borderColor?: string }> = {
  primary: { bg: C.blue, color: '#fff' },
  secondary: { bg: '#fff', color: C.black, borderColor: C.line },
  ghost: { bg: 'transparent', color: C.blue },
  tonal: { bg: C.bg3, color: C.black },
  negative: { bg: '#fff', color: C.red, borderColor: C.line },
};

export function Button({
  children,
  variant = 'primary',
  size = 'lg',
  onPress,
  disabled,
  full,
  style,
  leading,
}: Props) {
  const s = sizes[size];
  const v = variants[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        {
          height: s.height,
          borderRadius: s.borderRadius,
          paddingHorizontal: s.paddingHorizontal,
          backgroundColor: disabled ? C.disable : v.bg,
          borderWidth: v.borderColor ? 1 : 0,
          borderColor: v.borderColor,
          alignSelf: full ? 'stretch' : 'auto',
        },
        style,
      ]}
    >
      {leading}
      <Text
        style={[
          styles.label,
          {
            fontSize: s.fontSize,
            color: disabled ? C.text4 : v.color,
          },
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  label: {
    fontWeight: '600',
    letterSpacing: -0.04,
  },
});
