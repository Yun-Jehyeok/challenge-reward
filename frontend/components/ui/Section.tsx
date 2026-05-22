import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { ReactNode } from 'react';
import { C } from '../../constants/theme';

interface Props {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  style?: ViewStyle;
}

export function Section({ title, action, children, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {(title || action) && (
        <View style={styles.header}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {action ?? null}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: C.black,
    letterSpacing: -0.04,
  },
});
