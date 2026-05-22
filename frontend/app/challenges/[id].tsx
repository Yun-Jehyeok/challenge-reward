import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';
import { useChallenge } from '../../hooks/queries/useChallenge';
import { useJoinChallenge } from '../../hooks/mutations/useJoinChallenge';
import { toast } from '../../stores/toastStore';
import { C } from '../../constants/theme';

const COVER_COLORS = ['#00AEFF', '#FF9200', '#6541F2', '#FF5E00', '#00BF40', '#0066FF'];
function coverColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return COVER_COLORS[h % COVER_COLORS.length];
}

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
  const { data: c, isLoading } = useChallenge(id);
  const { mutate: join, isPending: joining } = useJoinChallenge(id);

  const handleJoin = () => {
    join(undefined, {
      onSuccess: () => toast.success('챌린지에 참여했어요!'),
      onError: (err: any) => {
        const status = err?.response?.status;
        if (status === 409) toast.error('이미 참여 중인 챌린지예요');
        else if (status === 410) toast.error('종료된 챌린지예요');
        else if (status === 400) toast.error('참여 인원이 가득 찼어요');
        else toast.error('참여에 실패했어요');
      },
    });
  };

  if (isLoading || !c) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={C.blue} />
      </View>
    );
  }

  const color = coverColor(c.id);

  return (
    <View style={styles.container}>
      <View style={[styles.heroWrap, { backgroundColor: color }]}>
        <View style={styles.heroOverlay} />
        <Pressable onPress={() => router.back()} style={styles.heroBack}>
          <Ionicons name="chevron-back" size={20} color="#000" />
        </Pressable>
        <View style={styles.heroActions}>
          <Pressable style={styles.heroActionBtn}>
            <Ionicons name="share-social-outline" size={18} color="#000" />
          </Pressable>
        </View>
        <View style={styles.heroBottom}>
          {c.isEnded && <Chip size="sm" variant="neutral" style={styles.heroChip}>종료된 챌린지</Chip>}
          <Text style={styles.heroTitle}>{c.title}</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.statsCard}>
          <DetailStat label="참여자" value={`${c.participantCount}명`} />
          <View style={styles.statsDivider} />
          <DetailStat label="시작" value={c.startDate} />
          <View style={styles.statsDivider} />
          <DetailStat label="종료" value={c.endDate} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>소개</Text>
          <Text style={styles.description}>{c.description}</Text>
          {c.maxParticipants && (
            <View style={styles.dateRow}>
              <Ionicons name="people-outline" size={14} color={C.text3} />
              <Text style={styles.dateText}>최대 {c.maxParticipants}명</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.cta}>
        <View style={styles.ctaInner}>
          {c.isEnded ? (
            <Button full disabled>종료된 챌린지</Button>
          ) : c.isJoined ? (
            <Button full onPress={() => router.push(`/proofs/upload?challengeId=${c.id}`)}>
              오늘 인증하기
            </Button>
          ) : (
            <Button full onPress={handleJoin} disabled={joining}>
              {joining ? '처리 중...' : '참여하기'}
            </Button>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  heroWrap: { width: '100%', height: 220, position: 'relative' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  heroBack: {
    position: 'absolute', top: 12, left: 12,
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroActions: { position: 'absolute', top: 12, right: 12, flexDirection: 'row', gap: 8 },
  heroActionBtn: {
    width: 40, height: 40, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroBottom: { position: 'absolute', left: 20, bottom: 16, right: 20 },
  heroChip: { backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-start' },
  heroTitle: {
    fontSize: 24, fontWeight: '800', color: '#fff',
    letterSpacing: -0.5, marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.3)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
  },
  scroll: { flex: 1 },
  statsCard: {
    flexDirection: 'row',
    marginHorizontal: 20, marginTop: 20,
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
  cta: { borderTopWidth: 1, borderTopColor: C.line2, backgroundColor: '#fff' },
  ctaInner: { padding: 12, paddingHorizontal: 20, paddingBottom: 8 },
});
