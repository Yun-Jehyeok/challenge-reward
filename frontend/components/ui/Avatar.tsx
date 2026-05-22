import { View, Text, Image, StyleSheet } from 'react-native';

const COLORS = ['#0066FF', '#FF5E00', '#6541F2', '#00BF40', '#FF9200', '#CB59FF', '#00BDDE', '#FF4242'];

function seedColor(name: string) {
  let hash = 0;
  for (const c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xffff;
  return COLORS[Math.abs(hash) % COLORS.length];
}

interface Props {
  name?: string;
  size?: number;
  src?: string;
}

export function Avatar({ name = '?', size = 36, src }: Props) {
  const bg = seedColor(name);

  return (
    <View
      style={[
        styles.container,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: src ? 'transparent' : bg },
      ]}
    >
      {src ? (
        <Image source={{ uri: src }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={[styles.initial, { fontSize: size * 0.4, color: '#fff' }]}>{name[0]}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  initial: {
    fontWeight: '600',
  },
});
