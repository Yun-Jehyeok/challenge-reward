import { View, Text, StyleSheet } from 'react-native';
import { C } from '../../constants/theme';

interface Props {
  days: number;
  size?: 'md' | 'lg';
}

export function Streak({ days, size = 'md' }: Props) {
  const big = size === 'lg';
  return (
    <View style={styles.row}>
      <Text style={[styles.flame, { fontSize: big ? 18 : 14 }]}>🔥</Text>
      <Text style={[styles.label, { fontSize: big ? 18 : 13 }]}>{days}일</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  flame: {},
  label: {
    fontWeight: '700',
    color: C.coral,
    letterSpacing: 0.3,
  },
});
