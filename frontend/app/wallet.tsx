import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar } from '../components/ui/AppBar';
import { Button } from '../components/ui/Button';
import { C } from '../constants/theme';

const POINTS = 1284;
const TX = [
  { id: 'w1', label: '복권 당첨', amount: 10, when: '오늘 14:32', from: '하루 물 2L 마시기' },
  { id: 'w2', label: '복권 당첨', amount: 1, when: '오늘 08:11', from: '아침 6시 기상' },
  { id: 'w3', label: '복권 당첨', amount: 3, when: '어제 22:04', from: '퇴근 후 30분 독서' },
  { id: 'w4', label: '복권 당첨', amount: 1, when: '어제 13:18', from: '하루 물 2L' },
  { id: 'w5', label: '복권 당첨', amount: 100, when: '2일 전 19:22', from: '아침 6시 기상' },
  { id: 'w6', label: '복권 당첨', amount: 3, when: '2일 전 08:30', from: '하루 물 2L' },
  { id: 'w7', label: '복권 당첨', amount: 5, when: '3일 전 21:00', from: '퇴근 후 30분 독서' },
];

export default function WalletScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppBar title="지갑" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Balance */}
        <View style={styles.balanceSection}>
          <Text style={styles.balanceLabel}>누적 포인트</Text>
          <Text style={styles.balance}>
            {POINTS.toLocaleString()}
            <Text style={styles.balanceUnit}>원</Text>
          </Text>
          <View style={styles.balanceBtns}>
            <Button variant="secondary" size="md" style={styles.balanceBtn} disabled>
              출금 (준비 중)
            </Button>
            <Button variant="tonal" size="md" style={styles.balanceBtn} onPress={() => router.push('/(tabs)/tickets')}>
              복권함
            </Button>
          </View>
        </View>

        {/* Transaction history */}
        <View style={styles.txSection}>
          <Text style={styles.txTitle}>거래 내역</Text>
          <View style={styles.txCard}>
            {TX.map((t, i) => (
              <View key={t.id} style={[styles.txRow, i < TX.length - 1 && styles.txRowBorder]}>
                <View style={styles.txIcon}>
                  <Text style={styles.txIconText}>+</Text>
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txLabel}>{t.label}</Text>
                  <Text style={styles.txMeta}>{t.from} · {t.when}</Text>
                </View>
                <Text style={styles.txAmount}>+{t.amount}원</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg2 },
  balanceSection: { backgroundColor: '#fff', padding: 20, paddingBottom: 28 },
  balanceLabel: { fontSize: 13, color: C.text3 },
  balance: { fontSize: 36, fontWeight: '800', letterSpacing: -0.8, marginTop: 6, color: C.black },
  balanceUnit: { fontSize: 20, fontWeight: '700', color: C.text2, marginLeft: 4 },
  balanceBtns: { flexDirection: 'row', gap: 8, marginTop: 16 },
  balanceBtn: { flex: 1 },
  txSection: { padding: 20, paddingBottom: 32 },
  txTitle: { fontSize: 16, fontWeight: '700', color: C.black, marginBottom: 12 },
  txCard: {
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: C.line, overflow: 'hidden',
  },
  txRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14,
  },
  txRowBorder: { borderBottomWidth: 1, borderBottomColor: C.line2 },
  txIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.greenLow,
    alignItems: 'center', justifyContent: 'center',
  },
  txIconText: { fontSize: 14, fontWeight: '700', color: C.green },
  txInfo: { flex: 1 },
  txLabel: { fontSize: 14, fontWeight: '600', color: C.black },
  txMeta: { fontSize: 12, color: C.text3, marginTop: 2 },
  txAmount: { fontSize: 15, fontWeight: '700', color: C.green },
});
