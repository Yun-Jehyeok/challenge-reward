import { useState } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Empty } from '../../components/ui/Empty';
import { useTickets } from '../../hooks/queries/useTickets';
import { TicketStatus, TicketSummary } from '../../api/modules/tickets';
import { C } from '../../constants/theme';

const TABS: { label: string; value: TicketStatus }[] = [
  { label: '미사용', value: 'pending' },
  { label: '광고 완료', value: 'ad_completed' },
  { label: '사용 완료', value: 'scratched' },
];

const ODDS = [
  ['1원', '60%'], ['3원', '25%'], ['5원', '10%'],
  ['10원', '4.8%'], ['10만원', '0.19%'], ['50만원', '0.009%'], ['100만원', '0.001%'],
];

function TicketCard({ ticket, num }: { ticket: TicketSummary; num: number }) {
  const router = useRouter();
  const isScratched = ticket.status === 'scratched';

  return (
    <Pressable
      onPress={() => router.push(`/tickets/${ticket.id}`)}
      style={[styles.ticketCard, isScratched && styles.ticketCardDim]}
    >
      <View style={styles.ticketLeft}>
        <Text style={styles.ticketEmoji}>🎫</Text>
        <Text style={styles.ticketNum}>#{String(num).padStart(3, '0')}</Text>
      </View>
      <View style={styles.ticketDivider} />
      <View style={styles.ticketRight}>
        <Text style={styles.ticketEarned}>{new Date(ticket.createdAt).toLocaleDateString('ko-KR')} 획득</Text>
        <Text style={styles.ticketFrom}>{ticket.challengeTitle}</Text>
        {!isScratched && <Text style={styles.ticketCta}>긁어서 확인 →</Text>}
        {isScratched && <Text style={[styles.ticketCta, { color: C.text3 }]}>사용 완료</Text>}
      </View>
    </Pressable>
  );
}

export default function TicketsScreen() {
  const [activeTab, setActiveTab] = useState<TicketStatus>('pending');
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useTickets(activeTab);
  const items = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headline}>복권함</Text>
        <View style={styles.tabs}>
          {TABS.map((tab) => (
            <Pressable
              key={tab.value}
              onPress={() => setActiveTab(tab.value)}
              style={[styles.tab, activeTab === tab.value && styles.tabActive]}
            >
              <Text style={[styles.tabLabel, activeTab === tab.value && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <TicketCard ticket={item} num={index + 1} />}
        contentContainerStyle={styles.body}
        onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          isLoading
            ? <ActivityIndicator color={C.blue} style={{ marginTop: 40 }} />
            : <Empty icon="bookmark" title="복권이 없어요" sub="챌린지를 인증하고 승인받으면 복권이 와요" />
        }
        ListFooterComponent={
          <>
            {isFetchingNextPage && <ActivityIndicator color={C.blue} style={{ marginVertical: 16 }} />}
            <View style={styles.oddsCard}>
              <Text style={styles.oddsTitle}>당첨 확률 안내</Text>
              <View style={styles.oddsGrid}>
                {ODDS.map(([amount, prob]) => (
                  <View key={amount} style={styles.oddsBadge}>
                    <Text style={styles.oddsBadgeText}>{amount} · {prob}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg2 },
  header: { backgroundColor: '#fff', padding: 20, paddingBottom: 0 },
  headline: { fontSize: 24, fontWeight: '800', color: C.black, letterSpacing: -0.5, marginBottom: 16 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: C.line },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: C.black },
  tabLabel: { fontSize: 14, fontWeight: '600', color: C.text3 },
  tabLabelActive: { color: C.black },
  body: { padding: 20, paddingBottom: 32, gap: 10 },
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.line,
    overflow: 'hidden',
  },
  ticketCardDim: { opacity: 0.6 },
  ticketLeft: {
    width: 76,
    backgroundColor: '#FFE0B5',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 14,
  },
  ticketEmoji: { fontSize: 22 },
  ticketNum: { fontSize: 11, fontWeight: '700', color: '#9C5800', letterSpacing: 0.4 },
  ticketDivider: { width: 1, backgroundColor: 'rgba(112,115,124,0.4)' },
  ticketRight: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  ticketEarned: { fontSize: 11, letterSpacing: 0.3, color: C.text3 },
  ticketFrom: { fontSize: 15, fontWeight: '600', color: C.black, marginTop: 4 },
  ticketCta: { fontSize: 12, fontWeight: '600', color: C.coral, marginTop: 6 },
  oddsCard: {
    marginTop: 24, padding: 16,
    borderRadius: 14, backgroundColor: C.bg3,
  },
  oddsTitle: { fontSize: 13, fontWeight: '600', color: C.text2, marginBottom: 6 },
  oddsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  oddsBadge: {
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 999, backgroundColor: '#fff',
    borderWidth: 1, borderColor: C.line,
  },
  oddsBadgeText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.3, color: C.text2 },
});
