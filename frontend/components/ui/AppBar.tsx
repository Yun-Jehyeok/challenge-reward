import { View, Text, Pressable, StyleSheet } from 'react-native';
import { ReactNode } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../../constants/theme';

interface Props {
  title?: string;
  sub?: string;
  onBack?: () => void;
  right?: ReactNode;
}

export function AppBar({ title, sub, onBack, right }: Props) {
  const router = useRouter();

  const handleBack = onBack ?? (() => router.back());

  return (
    <View style={styles.container}>
      <Pressable onPress={handleBack} style={styles.backBtn} hitSlop={8}>
        <Ionicons name="chevron-back" size={22} color={C.black} />
      </Pressable>

      <View style={styles.titleWrap}>
        {title ? (
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        ) : null}
        {sub ? <Text style={styles.sub}>{sub}</Text> : null}
      </View>

      <View style={styles.rightWrap}>{right ?? null}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 4,
    backgroundColor: '#fff',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: C.black,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 12,
    color: C.text3,
    marginTop: 2,
  },
  rightWrap: {
    width: 44,
    alignItems: 'flex-end',
    paddingRight: 4,
  },
});
