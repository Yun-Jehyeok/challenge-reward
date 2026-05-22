import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Chip } from '../../components/ui/Chip';
import { Streak } from '../../components/ui/Streak';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Section } from '../../components/ui/Section';
import { Empty } from '../../components/ui/Empty';
import { useMe } from '../../hooks/queries/useMe';
import { useMyChallenges } from '../../hooks/queries/useMyChallenges';
import { useReviewQueueCount } from '../../hooks/queries/useReviewQueueCount';
import { MyChallengeItem } from '../../api/modules/challenges';
import { C } from '../../constants/theme';

const COVER_COLORS = ['#00AEFF', '#FF9200', '#6541F2', '#FF5E00', '#00BF40', '#0066FF'];

function coverColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return COVER_COLORS[h % COVER_COLORS.length];
}

function ChallengeCard({ c }: { c: MyChallengeItem }) {
  const router = useRouter();
  const progress = c.daysUntilEnd > 0 ? Math.max(0, 100 - (c.daysUntilEnd / 30) * 100) : 100;
  const color = coverColor(c.id);

  return (
    <Pressable onPress={() => router.push(`/challenges/${c.id}`)} style={styles.challengeCard}>
      <View style={styles.challengeCardRow}>
        <View style={[styles.challengeAvatar, { backgroundColor: color }]}>
          <Text style={styles.challengeAvatarText}>{c.title[0]}</Text>
        </View>
        <View style={styles.challengeInfo}>
          <View style={styles.chipRow}>
            {c.isEnded
              ? <Chip size="xs" variant="neutral">종료</Chip>
              : c.daysUntilEnd <= 3 && <Chip size="xs" variant="warning">D-{c.daysUntilEnd}</Chip>
            }
          </View>
          <Text style={styles.challengeTitle} numberOfLines={1}>{c.title}</Text>
          <View style={styles.metaRow}>
            <Streak days={c.currentStreak} />
            <Text style={styles.metaText}>D-{c.daysUntilEnd}</Text>
          </View>
        </View>
      </View>

      <ProgressBar value={progress} color={color} />

      {c.isEnded ? (
        <View style={styles.doneBadge}>
          <Text style={[styles.doneText, { color: C.text3 }]}>종료된 챌린지</Text>
        </View>
      ) : c.isTodayProofDone ? (
        <View style={styles.doneBadge}>
          <Text style={styles.doneText}>✓ 오늘 인증 완료</Text>
        </View>
      ) : (
        <Pressable
          onPress={(e) => { e.stopPropagation(); router.push(`/proofs/upload?challengeId=${c.id}`); }}
          style={styles.proofBtn}
        >
          <Text style={styles.proofBtnText}>오늘 인증하기</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { data: me } = useMe();
  const { data: challenges, isLoading: challengesLoading } = useMyChallenges();
  const { data: pendingCount } = useReviewQueueCount();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>안녕하세요, {me?.nickname ?? ''}님</Text>
            <Text style={styles.headline}>오늘도 잘 하고 있어요</Text>
          </View>
          <Pressable onPress={() => router.push('/settings')} style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={20} color={C.black} />
          </Pressable>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardFlex]}>
            <Text style={styles.statIcon}>🎫</Text>
            <Text style={styles.statLabel}>복권</Text>
            <Text style={[styles.statValue, { color: C.yellow }]}>{me?.ticketCount ?? 0}개</Text>
          </View>
          <View style={[styles.statCard, styles.statCardFlex]}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statLabel}>포인트</Text>
            <Text style={[styles.statValue, { color: C.blue }]}>{(me?.totalEarned ?? 0).toLocaleString()}</Text>
          </View>
        </View>

        {(pendingCount ?? 0) > 0 && (
          <Pressable onPress={() => router.push('/proofs/review')} style={styles.pendingBanner}>
            <View style={styles.pendingIcon}>
              <Ionicons name="document-text-outline" size={18} color="#fff" />
            </View>
            <View style={styles.pendingText}>
              <Text style={styles.pendingTitle}>승인 대기 {pendingCount}건이 있어요</Text>
              <Text style={styles.pendingSub}>같이 도전하는 사람들의 인증을 확인해주세요</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.blue} />
          </Pressable>
        )}

        <View style={styles.section}>
          <Section
            title="오늘의 챌린지"
            action={
              <Pressable onPress={() => router.push('/(tabs)/explore')}>
                <Text style={styles.sectionAction}>전체보기</Text>
              </Pressable>
            }
          >
            {challengesLoading ? (
              <ActivityIndicator color={C.blue} style={{ marginTop: 20 }} />
            ) : !challenges || challenges.length === 0 ? (
              <Empty icon="bookmark" title="참여 중인 챌린지가 없어요" sub="탐색 탭에서 챌린지를 찾아보세요" />
            ) : (
              <View style={{ gap: 12 }}>
                {challenges.map((c) => <ChallengeCard key={c.id} c={c} />)}
              </View>
            )}
          </Section>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg2 },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  greeting: { fontSize: 13, color: C.text3 },
  headline: { fontSize: 24, fontWeight: '800', color: C.black, letterSpacing: -0.5, marginTop: 4 },
  bellBtn: {
    width: 40, height: 40, borderRadius: 12,
    borderWidth: 1, borderColor: C.line,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  statCard: {
    backgroundColor: C.bg3, borderRadius: 14,
    padding: 12, gap: 4,
  },
  statCardFlex: { flex: 1 },
  statIcon: { fontSize: 16 },
  statLabel: { fontSize: 11, color: C.text3, letterSpacing: 0.3 },
  statValue: { fontSize: 18, fontWeight: '700', letterSpacing: -0.1 },
  pendingBanner: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 14,
    backgroundColor: C.blueLow,
  },
  pendingIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: C.blue,
    alignItems: 'center', justifyContent: 'center',
  },
  pendingText: { flex: 1 },
  pendingTitle: { fontSize: 14, fontWeight: '700', color: C.blue },
  pendingSub: { fontSize: 12, color: C.text3, marginTop: 2 },
  section: { paddingTop: 24 },
  sectionAction: { fontSize: 13, fontWeight: '600', color: C.text3 },
  challengeCard: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: C.line, gap: 12,
  },
  challengeCardRow: { flexDirection: 'row', gap: 12 },
  challengeAvatar: {
    width: 56, height: 56, borderRadius: 12, flexShrink: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  challengeAvatarText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  challengeInfo: { flex: 1, minWidth: 0 },
  chipRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  challengeTitle: { fontSize: 15, fontWeight: '600', color: C.black },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  metaText: { fontSize: 12, color: C.text3 },
  doneBadge: {
    height: 40, borderRadius: 10,
    backgroundColor: C.greenLow,
    alignItems: 'center', justifyContent: 'center',
  },
  doneText: { fontSize: 14, fontWeight: '600', color: C.green },
  proofBtn: {
    height: 40, borderRadius: 10,
    backgroundColor: C.black,
    alignItems: 'center', justifyContent: 'center',
  },
  proofBtnText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});
