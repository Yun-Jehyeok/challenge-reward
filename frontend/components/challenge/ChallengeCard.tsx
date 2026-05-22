import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Chip } from '../ui/Chip';
import { Streak } from '../ui/Streak';
import { ProgressBar } from '../ui/ProgressBar';
import { MyChallengeItem } from '../../api/modules/challenges';
import { C } from '../../constants/theme';

const COVER_COLORS = ['#00AEFF', '#FF9200', '#6541F2', '#FF5E00', '#00BF40', '#0066FF'];
export function coverColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return COVER_COLORS[h % COVER_COLORS.length];
}

export function ChallengeCard({ c }: { c: MyChallengeItem }) {
  const router = useRouter();
  const progress = c.daysUntilEnd > 0 ? Math.max(0, 100 - (c.daysUntilEnd / 30) * 100) : 100;
  const color = coverColor(c.id);

  return (
    <Pressable onPress={() => router.push(`/challenges/${c.id}`)} style={styles.card}>
      <View style={styles.row}>
        <View style={[styles.avatar, { backgroundColor: color }]}>
          <Text style={styles.avatarText}>{c.title[0]}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.chipRow}>
            {c.isEnded
              ? <Chip size="xs" variant="neutral">종료</Chip>
              : c.daysUntilEnd <= 3 && <Chip size="xs" variant="warning">D-{c.daysUntilEnd}</Chip>
            }
          </View>
          <Text style={styles.title} numberOfLines={1}>{c.title}</Text>
          <View style={styles.metaRow}>
            <Streak days={c.currentStreak} />
            <Text style={styles.meta}>D-{c.daysUntilEnd}</Text>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: C.line, gap: 12,
  },
  row: { flexDirection: 'row', gap: 12 },
  avatar: {
    width: 56, height: 56, borderRadius: 12, flexShrink: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#fff' },
  info: { flex: 1, minWidth: 0 },
  chipRow: { flexDirection: 'row', gap: 6, marginBottom: 4 },
  title: { fontSize: 15, fontWeight: '600', color: C.black },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  meta: { fontSize: 12, color: C.text3 },
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
