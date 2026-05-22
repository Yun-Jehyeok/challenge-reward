import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'react-native';

function seedHue(seed: string): [number, number] {
  let h = 0;
  for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) & 0xffff;
  return [h % 360, (h * 17) % 360];
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

interface Props {
  seed?: string;
  uri?: string;
  style?: ViewStyle;
  label?: string;
}

export function PhotoPlaceholder({ seed = 'a', uri, style, label }: Props) {
  if (uri) {
    return <Image source={{ uri }} style={[styles.base, style]} resizeMode="cover" />;
  }

  const [h1, h2] = seedHue(seed);
  const color1 = hslToHex(h1, 70, 70);
  const color2 = hslToHex(h2, 60, 55);

  return (
    <View
      style={[
        styles.base,
        { backgroundColor: color1 },
        style,
      ]}
    >
      <View style={[StyleSheet.absoluteFill, { backgroundColor: color2, opacity: 0.5 }]} />
      {label ? <Text style={styles.label}>{label}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
});
