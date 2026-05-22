import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';
import { C } from '../../constants/theme';

const BASE_POINTS = 1284;

export default function RewardScreen() {
  const router = useRouter();
  const { amount: amountStr } = useLocalSearchParams<{ amount: string }>();
  const amount = parseInt(amountStr ?? '1', 10);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={{ height: 56 }} />

      <View style={styles.center}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🎉</Text>
        </View>
        <Text style={styles.savedLabel}>지갑에 적립되었어요</Text>
        <Text style={styles.amount}>
          +{amount.toLocaleString()}
          <Text style={styles.amountUnit}>원</Text>
        </Text>
        <Text style={styles.total}>
          누적 포인트 <Text style={styles.totalBold}>{(BASE_POINTS + amount).toLocaleString()}원</Text>
        </Text>
      </View>

      <View style={styles.footer}>
        <Button full onPress={() => router.replace('/(tabs)/tickets')}>
          남은 복권 더 긁기
        </Button>
        <Button full variant="ghost" onPress={() => router.replace('/wallet')}>
          지갑에서 확인하기
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 32, gap: 20,
  },
  iconWrap: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: '#FFF7E0',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#FF9200',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.32, shadowRadius: 32, elevation: 10,
  },
  icon: { fontSize: 56 },
  savedLabel: { fontSize: 14, color: C.text3 },
  amount: { fontSize: 56, fontWeight: '800', color: '#FF5E00', letterSpacing: -1.5 },
  amountUnit: { fontSize: 28, fontWeight: '700', marginLeft: 4 },
  total: { fontSize: 14, color: C.text3, textAlign: 'center' },
  totalBold: { fontWeight: '700', color: C.black },
  footer: {
    padding: 12, paddingHorizontal: 20, gap: 8,
    borderTopWidth: 1, borderTopColor: C.line2,
  },
});
