import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Modal, Image, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppBar } from '../../components/ui/AppBar';
import { Avatar } from '../../components/ui/Avatar';
import { Chip } from '../../components/ui/Chip';
import { Button } from '../../components/ui/Button';
import { useProof } from '../../hooks/queries/useProof';
import { useVoteProof } from '../../hooks/mutations/useVoteProof';
import { useReportProof } from '../../hooks/mutations/useReportProof';
import { ReportReason } from '../../api/modules/proofs';
import { toast } from '../../stores/toastStore';
import { C } from '../../constants/theme';

const REPORT_REASONS: { label: string; value: ReportReason }[] = [
  { label: '챌린지와 무관한 사진', value: 'irrelevant_photo' },
  { label: '도배 / 반복 게시', value: 'spam' },
  { label: '타인의 사진 도용', value: 'stolen_photo' },
  { label: '혐오 / 불쾌한 콘텐츠', value: 'hate_speech' },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return '방금 전';
  if (m < 60) return `${m}분 전`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}시간 전`;
  return `${Math.floor(h / 24)}일 전`;
}

export default function ProofDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [reportModal, setReportModal] = useState(false);

  const { data: proof, isLoading } = useProof(id);
  const { mutate: vote, isPending: voting } = useVoteProof(id);
  const { mutate: report, isPending: reporting } = useReportProof(id);

  const isSettled = proof?.status === 'approved' || proof?.status === 'rejected';

  const handleVote = (type: 'approve' | 'reject') => {
    vote(type, {
      onSuccess: () => {
        toast.success(type === 'approve' ? '승인했어요' : '거부했어요');
        setTimeout(() => router.back(), 400);
      },
      onError: (err: any) => {
        const status = err?.response?.status;
        if (status === 409) toast.error('이미 투표한 인증이에요');
        else if (status === 410) toast.error('이미 결정된 인증이에요');
        else if (status === 400) toast.error('자신의 인증에는 투표할 수 없어요');
        else toast.error('투표에 실패했어요');
      },
    });
  };

  const handleReport = (reason: ReportReason) => {
    setReportModal(false);
    report(reason, {
      onSuccess: () => toast.success('신고가 접수됐어요'),
      onError: () => toast.error('신고에 실패했어요'),
    });
  };

  if (isLoading || !proof) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <AppBar title="인증 검토" />
        <ActivityIndicator color={C.blue} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppBar
        title="인증 검토"
        right={
          <Pressable onPress={() => setReportModal(true)} hitSlop={8}>
            <Ionicons name="flag-outline" size={18} color={C.neutral} />
          </Pressable>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.authorSection}>
          <Avatar name="?" size={36} />
          <View style={styles.authorInfo}>
            <Text style={styles.ago}>{timeAgo(proof.createdAt)}</Text>
          </View>
          <Chip size="sm" variant={proof.status === 'approved' ? 'positive' : proof.status === 'rejected' ? 'negative' : 'neutral'}>
            {proof.status === 'approved' ? '승인됨' : proof.status === 'rejected' ? '거부됨' : '검토 중'}
          </Chip>
        </View>

        {proof.imageUrl ? (
          <Image source={{ uri: proof.imageUrl }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, { backgroundColor: C.bg3 }]} />
        )}

        {proof.comment ? (
          <View style={styles.commentSection}>
            <Text style={styles.comment}>{proof.comment}</Text>
          </View>
        ) : null}

        <View style={styles.voteSection}>
          <View style={styles.voteCard}>
            <Chip size="sm" variant="positive">승인 {proof.approveCount}/3</Chip>
            <Chip size="sm" variant="negative">거부 {proof.rejectCount}/3</Chip>
            <View style={{ flex: 1 }} />
            <Text style={styles.voteHint}>3명 모이면 결정</Text>
          </View>
          <View style={styles.guideCard}>
            <Text style={styles.guideText}>챌린지에 맞는 진짜 인증인가요? 무관한 사진이거나 도배라면 신고해주세요.</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          variant="negative"
          size="lg"
          style={styles.footerBtn}
          disabled={voting || isSettled}
          onPress={() => handleVote('reject')}
        >
          거부
        </Button>
        <Button
          size="lg"
          style={styles.footerBtn}
          disabled={voting || isSettled}
          onPress={() => handleVote('approve')}
        >
          승인
        </Button>
      </View>

      <Modal visible={reportModal} transparent animationType="slide" onRequestClose={() => setReportModal(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setReportModal(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>신고 사유 선택</Text>
            {REPORT_REASONS.map((r) => (
              <Pressable key={r.value} onPress={() => handleReport(r.value)} style={styles.modalItem} disabled={reporting}>
                <Text style={styles.modalItemLabel}>{r.label}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setReportModal(false)} style={styles.modalCancel}>
              <Text style={styles.modalCancelLabel}>취소</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
  ago: { fontSize: 12, color: C.text3 },
  photo: { width: '100%', aspectRatio: 4 / 5 },
  commentSection: { padding: 16, backgroundColor: '#fff' },
  comment: { fontSize: 15, color: C.text2, lineHeight: 24 },
  voteSection: { padding: 20, gap: 16 },
  voteCard: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    padding: 16, borderRadius: 14, backgroundColor: '#fff',
    borderWidth: 1, borderColor: C.line,
  },
  voteHint: { fontSize: 12, color: C.text3 },
  guideCard: { padding: 14, borderRadius: 12, backgroundColor: C.bg3 },
  guideText: { fontSize: 13, color: C.text2, lineHeight: 20 },
  footer: {
    flexDirection: 'row', gap: 10,
    padding: 12, paddingHorizontal: 20,
    borderTopWidth: 1, borderTopColor: C.line2,
    backgroundColor: '#fff',
  },
  footerBtn: { flex: 1 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, paddingBottom: 36,
  },
  modalTitle: { fontSize: 16, fontWeight: '700', color: C.black, marginBottom: 16 },
  modalItem: {
    paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: C.line2,
  },
  modalItemLabel: { fontSize: 15, color: C.black },
  modalCancel: { paddingVertical: 14, alignItems: 'center' },
  modalCancelLabel: { fontSize: 15, fontWeight: '600', color: C.text3 },
});
