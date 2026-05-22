import { View, StyleSheet } from 'react-native';
import { C } from '../../constants/theme';

interface Props {
  value: number;
  max?: number;
  color?: string;
  height?: number;
}

export function ProgressBar({ value, max = 100, color = C.blue, height = 6 }: Props) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <View style={[styles.track, { height }]}>
      <View style={[styles.fill, { width: `${pct}%`, backgroundColor: color, height }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    borderRadius: 999,
    backgroundColor: C.line2,
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 999,
  },
});
