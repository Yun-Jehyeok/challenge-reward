import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar } from '../components/ui/AppBar';
import { Button } from '../components/ui/Button';
import { Empty } from '../components/ui/Empty';
import { useWallet, useWalletTransactions } from '../hooks/queries/useWallet';
import { WalletTransaction } from '../api/modules/wallet';
import { C } from '../constants/theme';

function TxRow({ item, isLast }: { item: WalletTransaction; isLast: boolean }) {
  const when = new Date(item.createdAt).toLocaleString('ko-KR', {
    month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit',
  });

  return (
    <View style={[styles.txRow, !isLast && styles.txRowBorder]}>
      <View style={styles.txIcon}>
        <Text style={styles.txIconText}>+</Text>
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txLabel}>복권 당첨</Text>
        <Text style={styles.txMeta}>{item.challengeTitle} · {when}</Text>
      </View>
      <Text style={styles.txAmount}>+{item.amount}원</Text>
    </View>
  );
}

export default function WalletScreen() {
  const router = useRouter();
  const { data: wallet, isLoading: walletLoading } = useWallet();
  const { data, isLoading: txLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useWalletTransactions();
  const txItems = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppBar title="지갑" />
      <FlatList
        data={txItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TxRow item={item} isLast={index === txItems.length - 1} />
        )}
        onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={
          <View style={styles.balanceSection}>
            <Text style={styles.balanceLabel}>누적 포인트</Text>
            {walletLoading ? (
              <ActivityIndicator color={C.blue} style={{ marginTop: 8 }} />
            ) : (
              <Text style={styles.balance}>
                {(wallet?.balance ?? 0).toLocaleString()}
                <Text style={styles.balanceUnit}>원</Text>
              </Text>
            )}
            <View style={styles.balanceBtns}>
              <Button variant="secondary" size="md" style={styles.balanceBtn} disabled>
                출금 (준비 중)
              </Button>
              <Button variant="tonal" size="md" style={styles.balanceBtn} onPress={() => router.push('/(tabs)/tickets')}>
                복권함
              </Button>
            </View>
            <Text style={styles.txTitle}>거래 내역</Text>
          </View>
        }
        ListEmptyComponent={
          txLoading
            ? <ActivityIndicator color={C.blue} style={{ marginTop: 20 }} />
            : <Empty icon="card" title="거래 내역이 없어요" sub="복권을 긁으면 포인트가 적립돼요" />
        }
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator color={C.blue} style={{ marginVertical: 16 }} /> : <View style={{ height: 32 }} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg2 },
  balanceSection: { backgroundColor: '#fff', padding: 20, paddingBottom: 20 },
  balanceLabel: { fontSize: 13, color: C.text3 },
  balance: { fontSize: 36, fontWeight: '800', letterSpacing: -0.8, marginTop: 6, color: C.black },
  balanceUnit: { fontSize: 20, fontWeight: '700', color: C.text2, marginLeft: 4 },
  balanceBtns: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 24 },
  balanceBtn: { flex: 1 },
  txTitle: { fontSize: 16, fontWeight: '700', color: C.black },
  listContent: { paddingBottom: 32 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: '#fff' },
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
