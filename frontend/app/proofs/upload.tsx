import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppBar } from '../../components/ui/AppBar';
import { Button } from '../../components/ui/Button';
import { PhotoPlaceholder } from '../../components/ui/PhotoPlaceholder';
import { C } from '../../constants/theme';

export default function UploadProofScreen() {
  const router = useRouter();
  const { challengeId } = useLocalSearchParams<{ challengeId: string }>();
  const [comment, setComment] = useState('');
  const [picked, setPicked] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppBar title="인증하기" sub="하루 물 2L 마시기" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Image picker */}
        {picked ? (
          <View style={styles.previewWrap}>
            <PhotoPlaceholder seed="upload-shot" style={styles.preview} />
            <Pressable onPress={() => setPicked(false)} style={styles.reselect}>
              <Text style={styles.reselectText}>다시 선택</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="image-outline" size={36} color={C.neutral} />
            <Text style={styles.placeholderText}>사진을 선택해주세요</Text>
            <View style={styles.pickerBtns}>
              <Button variant="secondary" size="md" onPress={() => setPicked(true)}
                leading={<Ionicons name="cloud-upload-outline" size={16} color={C.black} />}
              >
                갤러리
              </Button>
              <Button size="md" onPress={() => setPicked(true)}
                leading={<Ionicons name="camera-outline" size={16} color="#fff" />}
              >
                카메라
              </Button>
            </View>
          </View>
        )}

        {/* Comment */}
        <View style={styles.commentWrap}>
          <Text style={styles.commentLabel}>
            한 줄 메모 <Text style={styles.commentOptional}>(선택)</Text>
          </Text>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="오늘의 한마디를 남겨보세요"
            placeholderTextColor={C.text3}
            maxLength={80}
            multiline
            style={styles.commentInput}
          />
          <Text style={styles.commentCount}>{comment.length}/80</Text>
        </View>

        {/* Info banner */}
        <View style={styles.infoCard}>
          <Ionicons name="document-text-outline" size={18} color={C.blue} style={{ marginTop: 2 }} />
          <Text style={styles.infoText}>
            업로드하면 같은 챌린지 참여자 3명이 승인해야 복권이 지급돼요. 인증이 거부되면 streak가 초기화됩니다.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button full disabled={!picked} onPress={() => router.replace('/(tabs)')}>
          인증 업로드
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 16 },
  previewWrap: { borderRadius: 16, overflow: 'hidden', position: 'relative' },
  preview: { width: '100%', aspectRatio: 4 / 5, borderRadius: 16 },
  reselect: {
    position: 'absolute', right: 12, bottom: 12,
    height: 36, paddingHorizontal: 14, borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
  },
  reselectText: { fontSize: 13, fontWeight: '600', color: '#fff' },
  placeholder: {
    width: '100%', aspectRatio: 4 / 5, borderRadius: 16,
    backgroundColor: C.bg2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.line,
    alignItems: 'center', justifyContent: 'center', gap: 12,
  },
  placeholderText: { fontSize: 14, color: C.text3 },
  pickerBtns: { flexDirection: 'row', gap: 10, marginTop: 8 },
  commentWrap: { gap: 8 },
  commentLabel: { fontSize: 13, fontWeight: '600', color: C.text2 },
  commentOptional: { color: C.text3, fontWeight: '500' },
  commentInput: {
    height: 80, padding: 14, borderRadius: 12,
    borderWidth: 1, borderColor: C.line,
    fontSize: 15, color: C.black,
    textAlignVertical: 'top',
  },
  commentCount: { fontSize: 12, color: C.text3, textAlign: 'right' },
  infoCard: {
    flexDirection: 'row', gap: 10,
    padding: 14, borderRadius: 12, backgroundColor: C.blueLow,
  },
  infoText: { flex: 1, fontSize: 13, color: C.text2, lineHeight: 20 },
  footer: {
    borderTopWidth: 1, borderTopColor: C.line2,
    padding: 12, paddingHorizontal: 20, paddingBottom: 20,
  },
});
