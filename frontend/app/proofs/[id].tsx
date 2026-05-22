import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppBar } from '../../components/ui/AppBar';
import { Avatar } from '../../components/ui/Avatar';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';
import { PhotoPlaceholder } from '../../components/ui/PhotoPlaceholder';
import { C } from '../../constants/theme';

const PROOFS: Record<string, { id: string; author: string; challenge: string; seed: string; comment: string; ago: string; approves: number; rejects: number }> = {
  pr1: { id: 'pr1', author: '하늘', challenge: '하루 물 2L 마시기', seed: 'p-water-1', comment: '오늘도 1L 다 마셨어요. 화이팅!', ago: '12분 전', approves: 2, rejects: 0 },
  pr2: { id: 'pr2', author: '도윤', challenge: '아침 6시 기상 챌린지', seed: 'p-morn-1', comment: '오늘 일출 진짜 예뻤어요 🌅', ago: '34분 전', approves: 1, rejects: 0 },
  pr3: { id: 'pr3', author: '서연', challenge: '퇴근 후 30분 독서', seed: 'p-book-1', comment: '《미움받을 용기》 절반 읽었습니다', ago: '1시간 전', approves: 0, rejects: 0 },
};

export default function ProofDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = PROOFS[id ?? 'pr1'] ?? PROOFS['pr1'];

  const [voted, setVoted] = useState<'approve' | 'reject' | null>(null);

  const handleVote = (type: 'approve' | 'reject') => {
    setVoted(type);
    setTimeout(() => router.back(), 400);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppBar
        title="인증 검토"
        right={
          <Pressable hitSlop={8}>
            <Ionicons name="flag-outline" size={18} color={C.neutral} />
          </Pressable>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Author */}
        <View style={styles.authorSection}>
          <Avatar name={p.author} size={36} />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{p.author}</Text>
            <Text style={styles.ago}>{p.ago}</Text>
          </View>
          <Chip size="sm" variant="neutral">{p.challenge}</Chip>
        </View>

        {/* Photo */}
        <PhotoPlaceholder seed={p.seed} style={styles.photo} />

        {/* Comment */}
        {p.comment ? (
          <View style={styles.commentSection}>
            <Text style={styles.comment}>{p.comment}</Text>
          </View>
        ) : null}

        {/* Vote status */}
        <View style={styles.voteSection}>
          <View style={styles.voteCard}>
            <Chip size="sm" variant="positive">승인 {p.approves}/3</Chip>
            <Chip size="sm" variant="negative">거부 {p.rejects}/3</Chip>
            <View style={{ flex: 1 }} />
            <Text style={styles.voteHint}>3명 모이면 결정</Text>
          </View>

          <View style={styles.guideCard}>
            <Text style={styles.guideText}>챌린지에 맞는 진짜 인증인가요? 무관한 사진이거나 도배라면 신고해주세요.</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.footer}>
        <Button
          variant="negative"
          size="lg"
          style={styles.footerBtn}
          onPress={() => handleVote('reject')}
        >
          {voted === 'reject' ? '거부됨' : '거부'}
        </Button>
        <Button
          size="lg"
          style={styles.footerBtn}
          onPress={() => handleVote('approve')}
        >
          {voted === 'approve' ? '승인됨 ✓' : '승인'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg2 },
  authorSection: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 16, backgroundColor: '#fff',
  },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 15, fontWeight: '600', color: C.black },
  ago: { fontSize: 12, color: C.text3 },
  photo: { width: '100%', aspectRatio: 4 / 5, borderRadius: 0 },
  commentSection: {
    padding: 16, backgroundColor: '#fff',
  },
  comment: { fontSize: 15, color: C.text2, lineHeight: 24 },
  voteSection: { padding: 20, gap: 16 },
  voteCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 16, borderRadius: 14, backgroundColor: '#fff',
    borderWidth: 1, borderColor: C.line,
  },
  voteHint: { fontSize: 12, color: C.text3 },
  guideCard: {
    padding: 14, borderRadius: 12, backgroundColor: C.bg3,
  },
  guideText: { fontSize: 13, color: C.text2, lineHeight: 20 },
  footer: {
    flexDirection: 'row', gap: 10,
    padding: 12, paddingHorizontal: 20,
    borderTopWidth: 1, borderTopColor: C.line2,
    backgroundColor: '#fff',
  },
  footerBtn: { flex: 1 },
});
