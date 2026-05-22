import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PhotoPlaceholder } from '../../components/ui/PhotoPlaceholder';
import { Chip } from '../../components/ui/Chip';
import { Streak } from '../../components/ui/Streak';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Section } from '../../components/ui/Section';
import { C } from '../../constants/theme';

const MOCK_CHALLENGES = [
  { id: 'c1', title: '하루 물 2L 마시기', category: '생활습관', seed: 'water', daysLeft: 12, total: 30, streak: 7, participants: 248, todayDone: false, coverColor: '#00AEFF', endingSoon: false },
  { id: 'c2', title: '아침 6시 기상 챌린지', category: '갓생', seed: 'morning', daysLeft: 3, total: 21, streak: 18, participants: 86, todayDone: true, coverColor: '#FF9200', endingSoon: true },
  { id: 'c3', title: '퇴근 후 30분 독서', category: '자기계발', seed: 'book', daysLeft: 24, total: 30, streak: 5, participants: 412, todayDone: false, coverColor: '#6541F2', endingSoon: false },
];

const POPULAR = [
  { id: 'p1', title: '100일 코딩 챌린지', seed: 'code', category: '자기계발', participants: 1284 },
  { id: 'p2', title: '주 3회 홈트레이닝', seed: 'fit', category: '운동', participants: 832 },
  { id: 'p3', title: '하루 한 끼 식단 사진', seed: 'meal', category: '건강', participants: 567 },
  { id: 'p4', title: '매일 영어 단어 10개', seed: 'eng', category: '공부', participants: 921 },
];

const PENDING_COUNT = 5;
const STREAK = 7;
const TICKETS = 3;
const POINTS = 1284;

function ChallengeCard({ c }: { c: typeof MOCK_CHALLENGES[0] }) {
  const router = useRouter();
  const progress = ((c.total - c.daysLeft) / c.total) * 100;

  return (
    <Pressable
      onPress={() => router.push(`/challenges/${c.id}`)}
      style={styles.challengeCard}
    >
      <View style={styles.challengeCardRow}>
        <View style={[styles.challengeAvatar, { backgroundColor: c.coverColor }]}>
          <Text style={styles.challengeAvatarText}>{c.title[0]}</Text>
        </View>
        <View style={styles.challengeInfo}>
          <View style={styles.chipRow}>
            <Chip size="xs" variant="neutral">{c.category}</Chip>
            {c.endingSoon && <Chip size="xs" variant="warning">D-{c.daysLeft}</Chip>}
          </View>
          <Text style={styles.challengeTitle} numberOfLines={1}>{c.title}</Text>
          <View style={styles.metaRow}>
            <Streak days={c.streak} />
            <Text style={styles.metaText}>D-{c.daysLeft} · {c.participants}명</Text>
          </View>
        </View>
      </View>

      <ProgressBar value={progress} color={c.coverColor} />

      {c.todayDone ? (
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

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>안녕하세요, 지수님</Text>
            <Text style={styles.headline}>오늘도 잘 하고 있어요</Text>
          </View>
          <Pressable onPress={() => router.push('/settings')} style={styles.bellBtn}>
            <Ionicons name="notifications-outline" size={20} color={C.black} />
          </Pressable>
        </View>

        {/* Mini stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.statCardFlex]}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statLabel}>현재 streak</Text>
            <Text style={[styles.statValue, { color: C.coral }]}>{STREAK}일</Text>
          </View>
          <View style={[styles.statCard, styles.statCardFlex]}>
            <Text style={styles.statIcon}>🎫</Text>
            <Text style={styles.statLabel}>복권</Text>
            <Text style={[styles.statValue, { color: C.yellow }]}>{TICKETS}개</Text>
          </View>
          <View style={[styles.statCard, styles.statCardFlex]}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statLabel}>포인트</Text>
            <Text style={[styles.statValue, { color: C.blue }]}>{POINTS.toLocaleString()}</Text>
          </View>
        </View>

        {/* Pending banner */}
        {PENDING_COUNT > 0 && (
          <Pressable onPress={() => router.push('/proofs/review')} style={styles.pendingBanner}>
            <View style={styles.pendingIcon}>
              <Ionicons name="document-text-outline" size={18} color="#fff" />
            </View>
            <View style={styles.pendingText}>
              <Text style={styles.pendingTitle}>승인 대기 {PENDING_COUNT}건이 있어요</Text>
              <Text style={styles.pendingSub}>같이 도전하는 사람들의 인증을 확인해주세요</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.blue} />
          </Pressable>
        )}

        {/* My challenges */}
        <View style={styles.section}>
          <Section
            title="오늘의 챌린지"
            action={
              <Pressable onPress={() => router.push('/explore')}>
                <Text style={styles.sectionAction}>전체보기</Text>
              </Pressable>
            }
          >
            <View style={{ gap: 12 }}>
              {MOCK_CHALLENGES.map((c) => <ChallengeCard key={c.id} c={c} />)}
            </View>
          </Section>
        </View>

        {/* Popular challenges */}
        <View style={[styles.section, { marginTop: 28 }]}>
          <Section title="추천 챌린지">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.popularScroll}>
              {POPULAR.map((p) => (
                <Pressable key={p.id} onPress={() => router.push(`/challenges/${p.id}`)} style={styles.popularCard}>
                  <PhotoPlaceholder seed={p.seed} style={styles.popularImg} />
                  <Chip size="xs" variant="neutral" style={{ marginTop: 10 }}>{p.category}</Chip>
                  <Text style={styles.popularTitle}>{p.title}</Text>
                  <Text style={styles.popularMeta}>참여 {p.participants.toLocaleString()}명</Text>
                </Pressable>
              ))}
            </ScrollView>
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
  popularScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  popularCard: { width: 168, marginRight: 12 },
  popularImg: { width: 168, height: 112 },
  popularTitle: { fontSize: 14, fontWeight: '600', color: C.black, marginTop: 6 },
  popularMeta: { fontSize: 12, color: C.text3, marginTop: 4 },
});
