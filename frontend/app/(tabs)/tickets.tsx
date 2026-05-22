import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Empty } from '../../components/ui/Empty';
import { C } from '../../constants/theme';

const TICKETS = [
  { id: 't1', from: '하루 물 2L 마시기', earnedAt: '오늘' },
  { id: 't2', from: '아침 6시 기상 챌린지', earnedAt: '오늘' },
  { id: 't3', from: '퇴근 후 30분 독서', earnedAt: '어제' },
];

const ODDS = [
  ['1원', '60%'], ['3원', '25%'], ['5원', '10%'],
  ['10원', '4.8%'], ['10만원', '0.19%'], ['50만원', '0.009%'], ['100만원', '0.001%'],
];

function TicketCard({ ticket, num }: { ticket: typeof TICKETS[0]; num: number }) {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push({ pathname: '/tickets/ad', params: { ticketId: ticket.id } })} style={styles.ticketCard}>
      <View style={styles.ticketLeft}>
        <Text style={styles.ticketEmoji}>🎫</Text>
        <Text style={styles.ticketNum}>#{String(num).padStart(3, '0')}</Text>
      </View>
      <View style={styles.ticketDivider} />
      <View style={styles.ticketRight}>
        <Text style={styles.ticketEarned}>{ticket.earnedAt} 획득</Text>
        <Text style={styles.ticketFrom}>{ticket.from}</Text>
        <Text style={styles.ticketCta}>긁어서 확인 →</Text>
      </View>
    </Pressable>
  );
}

export default function TicketsScreen() {
  const count = TICKETS.length;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header summary */}
        <View style={styles.header}>
          <Text style={styles.headline}>복권함</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryLabel}>보유 복권</Text>
              <Text style={styles.summaryCount}>
                {count}<Text style={styles.summaryUnit}>개</Text>
              </Text>
              <Text style={styles.summarySub}>긁어서 포인트로 바꿔보세요</Text>
            </View>
            <View style={styles.summaryIcon}>
              <Text style={styles.summaryEmoji}>🎫</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.sectionTitle}>긁지 않은 복권</Text>

          {count > 0 ? (
            <View style={styles.ticketList}>
              {TICKETS.map((t, i) => <TicketCard key={t.id} ticket={t} num={i + 1} />)}
            </View>
          ) : (
            <Empty icon="bookmark" title="아직 복권이 없어요" sub="챌린지를 인증하고 승인받으면 복권이 와요" />
          )}

          {/* Odds info */}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg2 },
  header: { backgroundColor: '#fff', padding: 20, paddingBottom: 24 },
  headline: { fontSize: 24, fontWeight: '800', color: C.black, letterSpacing: -0.5 },
  summaryCard: {
    marginTop: 16,
    padding: 20,
    borderRadius: 18,
    backgroundColor: '#FFF7E0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  summaryLeft: { flex: 1 },
  summaryLabel: { fontSize: 12, letterSpacing: 0.3, color: '#D17600' },
  summaryCount: { fontSize: 32, fontWeight: '800', color: '#FF5E00', letterSpacing: -0.6, marginTop: 4 },
  summaryUnit: { fontSize: 18, fontWeight: '700', marginLeft: 4 },
  summarySub: { fontSize: 12, color: C.text3, marginTop: 6 },
  summaryIcon: {
    width: 72, height: 72, borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 4,
  },
  summaryEmoji: { fontSize: 32 },
  body: { padding: 20, paddingBottom: 32 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.black, marginBottom: 12 },
  ticketList: { gap: 10 },
  ticketCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.line,
    overflow: 'hidden',
  },
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
  ticketDivider: {
    width: 1,
    backgroundColor: 'rgba(112,115,124,0.4)',
  },
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
