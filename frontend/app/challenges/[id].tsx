import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../../components/ui/Avatar';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';
import { PhotoPlaceholder } from '../../components/ui/PhotoPlaceholder';
import { C } from '../../constants/theme';

const MOCK = {
  id: 'c1',
  title: '하루 물 2L 마시기',
  category: '생활습관',
  seed: 'water',
  description: '하루 물 2L를 꾸준히 마시는 습관을 만드는 챌린지입니다. 매일 마신 물병이나 컵 사진을 올려주세요. 카페인 음료나 주스는 인정되지 않아요.',
  creator: '지수',
  participants: 248,
  period: '30일',
  daysLeft: 12,
  proofFreq: '하루 1회',
  startDate: '2026.05.10',
  endDate: '2026.06.08',
  recentProofs: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
  isJoined: true,
};

function DetailStat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailStat}>
      <Text style={styles.detailStatLabel}>{label}</Text>
      <Text style={styles.detailStatValue}>{value}</Text>
    </View>
  );
}

export default function ChallengeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = MOCK;

  return (
    <View style={styles.container}>
      {/* Hero image */}
      <View style={styles.heroWrap}>
        <PhotoPlaceholder seed={c.seed} style={styles.hero} />
        <View style={styles.heroOverlay} />

        <Pressable onPress={() => router.back()} style={styles.heroBack}>
          <Ionicons name="chevron-back" size={20} color="#000" />
        </Pressable>

        <View style={styles.heroActions}>
          <Pressable style={styles.heroActionBtn}>
            <Ionicons name="share-social-outline" size={18} color="#000" />
          </Pressable>
          <Pressable style={styles.heroActionBtn}>
            <Ionicons name="bookmark-outline" size={18} color="#000" />
          </Pressable>
        </View>

        <View style={styles.heroBottom}>
          <Chip size="sm" variant="neutral" style={styles.heroChip}>{c.category}</Chip>
          <Text style={styles.heroTitle}>{c.title}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Creator */}
        <View style={styles.creatorRow}>
          <Avatar name={c.creator} size={28} />
          <Text style={styles.creatorName}>{c.creator}</Text>
          <Text style={styles.creatorRole}>· 챌린지 메이커</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsCard}>
          <DetailStat label="참여자" value={`${c.participants}`} />
          <View style={styles.statsDivider} />
          <DetailStat label="기간" value={c.period} />
          <View style={styles.statsDivider} />
          <DetailStat label="인증주기" value={c.proofFreq} />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>소개</Text>
          <Text style={styles.description}>{c.description}</Text>
          <View style={styles.dateRow}>
            <Ionicons name="calendar-outline" size={14} color={C.text3} />
            <Text style={styles.dateText}>{c.startDate} ~ {c.endDate}</Text>
          </View>
        </View>

        {/* Recent proofs */}
        <View style={styles.section}>
          <View style={styles.proofHeader}>
            <Text style={styles.sectionTitle}>최근 인증</Text>
            <Text style={styles.proofCount}>{c.participants}명 인증 중</Text>
          </View>
          <View style={styles.proofGrid}>
            {c.recentProofs.map((s, i) => (
              <PhotoPlaceholder key={i} seed={c.seed + s} style={styles.proofThumb} />
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <SafeAreaView edges={['bottom']} style={styles.cta}>
        <View style={styles.ctaInner}>
          {c.isJoined ? (
            <Button full onPress={() => router.push(`/proofs/upload?challengeId=${c.id}`)}>
              오늘 인증하기
            </Button>
          ) : (
            <Button full onPress={() => {}}>
              참여하기
            </Button>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroWrap: { width: '100%', height: 220, position: 'relative' },
  hero: { width: '100%', height: 220, borderRadius: 0 },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroBack: {
    position: 'absolute', top: 12, left: 12,
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroActions: {
    position: 'absolute', top: 12, right: 12,
    flexDirection: 'row', gap: 8,
  },
  heroActionBtn: {
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBottom: {
    position: 'absolute', left: 20, bottom: 16, right: 20,
  },
  heroChip: { backgroundColor: 'rgba(255,255,255,0.9)' },
  heroTitle: {
    fontSize: 24, fontWeight: '800', color: '#fff',
    letterSpacing: -0.5, marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  scroll: { flex: 1 },
  creatorRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 20, paddingVertical: 16,
  },
  creatorName: { fontSize: 13, fontWeight: '600', color: C.black },
  creatorRole: { fontSize: 12, color: C.text3 },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 14,
    backgroundColor: C.bg2,
    alignItems: 'center',
  },
  statsDivider: { width: 1, height: 32, backgroundColor: C.line, marginHorizontal: 8 },
  detailStat: { flex: 1, alignItems: 'center', gap: 4 },
  detailStatLabel: { fontSize: 11, letterSpacing: 0.3, color: C.text3 },
  detailStatValue: { fontSize: 15, fontWeight: '700', color: C.black },
  section: { padding: 20, paddingBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: C.black, marginBottom: 8 },
  description: { fontSize: 15, color: C.text2, lineHeight: 24 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 16 },
  dateText: { fontSize: 13, color: C.text3 },
  proofHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  proofCount: { fontSize: 12, color: C.text3 },
  proofGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  proofThumb: { width: '31%', aspectRatio: 1, borderRadius: 8 },
  cta: { borderTopWidth: 1, borderTopColor: C.line2, backgroundColor: '#fff' },
  ctaInner: { padding: 12, paddingHorizontal: 20, paddingBottom: 8 },
});
