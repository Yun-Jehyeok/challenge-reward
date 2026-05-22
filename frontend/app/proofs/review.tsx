import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar } from '../../components/ui/AppBar';
import { Avatar } from '../../components/ui/Avatar';
import { Chip } from '../../components/ui/Chip';
import { PhotoPlaceholder } from '../../components/ui/PhotoPlaceholder';
import { C } from '../../constants/theme';

const PENDING = [
  { id: 'pr1', author: '하늘', challenge: '하루 물 2L 마시기', seed: 'p-water-1', comment: '오늘도 1L 다 마셨어요. 화이팅!', ago: '12분 전', approves: 2, rejects: 0 },
  { id: 'pr2', author: '도윤', challenge: '아침 6시 기상 챌린지', seed: 'p-morn-1', comment: '오늘 일출 진짜 예뻤어요 🌅', ago: '34분 전', approves: 1, rejects: 0 },
  { id: 'pr3', author: '서연', challenge: '퇴근 후 30분 독서', seed: 'p-book-1', comment: '《미움받을 용기》 절반 읽었습니다', ago: '1시간 전', approves: 0, rejects: 0 },
  { id: 'pr4', author: '예준', challenge: '하루 물 2L 마시기', seed: 'p-water-2', comment: '', ago: '2시간 전', approves: 1, rejects: 1 },
  { id: 'pr5', author: '지안', challenge: '퇴근 후 30분 독서', seed: 'p-book-2', comment: '오늘은 한강 작가님', ago: '3시간 전', approves: 2, rejects: 0 },
];

export default function ReviewScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppBar title="승인 대기" sub={`${PENDING.length}건의 인증을 검토해주세요`} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.list}>
          {PENDING.map((p) => (
            <Pressable key={p.id} onPress={() => router.push(`/proofs/${p.id}`)} style={styles.item}>
              <PhotoPlaceholder seed={p.seed} style={styles.thumb} />
              <View style={styles.info}>
                <View style={styles.authorRow}>
                  <Avatar name={p.author} size={20} />
                  <Text style={styles.authorName}>{p.author}</Text>
                  <Text style={styles.ago}>· {p.ago}</Text>
                </View>
                <Text style={styles.challenge} numberOfLines={1}>{p.challenge}</Text>
                <View style={styles.voteRow}>
                  <Chip size="xs" variant="positive">승인 {p.approves}/3</Chip>
                  {p.rejects > 0 && <Chip size="xs" variant="negative">거부 {p.rejects}/3</Chip>}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  list: { padding: 20, gap: 12 },
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
