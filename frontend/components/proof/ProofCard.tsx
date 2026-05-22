import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '../ui/Avatar';
import { Chip } from '../ui/Chip';
import { ReviewQueueItem } from '../../api/modules/proofs';
import { C } from '../../constants/theme';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export function ProofCard({ item }: { item: ReviewQueueItem }) {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push(`/proofs/${item.id}`)} style={styles.item}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
      ) : (
        <View style={[styles.thumb, { backgroundColor: C.bg3 }]} />
      )}
      <View style={styles.info}>
        <View style={styles.authorRow}>
          <Avatar name={item.uploaderNickname} size={20} />
          <Text style={styles.authorName}>{item.uploaderNickname}</Text>
          <Text style={styles.ago}>· {timeAgo(item.createdAt)}</Text>
        </View>
        <Text style={styles.challenge} numberOfLines={1}>{item.challengeTitle}</Text>
        <View style={styles.voteRow}>
          <Chip size="xs" variant="positive">승인 {item.approveCount}/3</Chip>
          {item.rejectCount > 0 && <Chip size="xs" variant="negative">거부 {item.rejectCount}/3</Chip>}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row', gap: 12,
    padding: 12, borderRadius: 14,
    borderWidth: 1, borderColor: C.line,
    backgroundColor: '#fff',
  },
  thumb: { width: 76, height: 76, borderRadius: 10, flexShrink: 0 },
  info: { flex: 1, justifyContent: 'space-between' },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authorName: { fontSize: 13, fontWeight: '600', color: C.black },
  ago: { fontSize: 12, color: C.text3 },
  challenge: { fontSize: 14, fontWeight: '600', color: C.black, marginTop: 6 },
  voteRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
});
