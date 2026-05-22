import { View, Text, StyleSheet } from 'react-native';
import { Icon } from './Icon';
import { C } from '../../constants/theme';

type IconName = Parameters<typeof Icon>[0]['name'];

interface Props {
  icon?: IconName;
  title: string;
  sub?: string;
}

export function Empty({ icon = 'document', title, sub }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrap}>
        <Icon name={icon} size={28} color={C.neutral} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {sub ? <Text style={styles.sub}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.bg3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: C.black,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    color: C.text3,
    textAlign: 'center',
    lineHeight: 22,
  },
});
