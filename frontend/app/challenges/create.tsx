import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar } from '../../components/ui/AppBar';
import { Button } from '../../components/ui/Button';
import { C } from '../../constants/theme';

const CATS = ['운동', '공부', '생활습관', '자기계발', '갓생', '건강'];
const DURATIONS = [7, 14, 21, 30, 60, 100];
const COLORS = ['#00AEFF', '#0066FF', '#6541F2', '#FF5E00', '#FF9200', '#00BF40'];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldHeader}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {hint ? <Text style={styles.fieldHint}>{hint}</Text> : null}
      </View>
      {children}
    </View>
  );
}

export default function CreateChallengeScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('생활습관');
  const [days, setDays] = useState(30);
  const [color, setColor] = useState('#00AEFF');
  const [maxPpl, setMaxPpl] = useState('100');

  const ok = title.trim().length >= 2;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppBar title="챌린지 만들기" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Field label="챌린지 이름" hint={`${title.length}/30`}>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="예: 하루 30분 독서"
            placeholderTextColor={C.text3}
            maxLength={30}
            style={styles.input}
          />
        </Field>

        <Field label="설명" hint={`${desc.length}/200`}>
          <TextInput
            value={desc}
            onChangeText={setDesc}
            placeholder="이 챌린지가 어떤 챌린지인지 알려주세요. 어떤 사진을 올려야 하는지도 적어주면 좋아요."
            placeholderTextColor={C.text3}
            maxLength={200}
            multiline
            style={[styles.input, styles.textarea]}
          />
        </Field>

        <Field label="카테고리">
          <View style={styles.catWrap}>
            {CATS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCat(c)}
                style={[styles.catBtn, cat === c && styles.catBtnActive]}
              >
                <Text style={[styles.catLabel, cat === c && styles.catLabelActive]}>{c}</Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label="기간">
          <View style={styles.durationWrap}>
            {DURATIONS.map((d) => (
              <Pressable
                key={d}
                onPress={() => setDays(d)}
                style={[styles.durationBtn, days === d && styles.durationBtnActive]}
              >
                <Text style={[styles.durationLabel, days === d && styles.durationLabelActive]}>{d}일</Text>
              </Pressable>
            ))}
          </View>
        </Field>

        <Field label="커버 색">
          <View style={styles.colorWrap}>
            {COLORS.map((co) => (
              <Pressable
                key={co}
                onPress={() => setColor(co)}
                style={[styles.colorBtn, { backgroundColor: co }, color === co && styles.colorBtnActive]}
              />
            ))}
          </View>
        </Field>

        <Field label="최대 인원">
          <TextInput
            value={maxPpl}
            onChangeText={setMaxPpl}
            keyboardType="number-pad"
            style={[styles.input, { textAlign: 'right' }]}
          />
        </Field>
      </ScrollView>

      <View style={styles.footer}>
        <Button full disabled={!ok} onPress={() => router.replace('/(tabs)')}>
          챌린지 시작하기
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  content: { padding: 20 },
  field: { marginBottom: 20 },
  fieldHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: C.text2 },
  fieldHint: { fontSize: 12, color: C.text3 },
  input: {
    width: '100%', height: 48, paddingHorizontal: 14,
    borderRadius: 10, borderWidth: 1, borderColor: C.line,
    fontSize: 15, color: C.black, backgroundColor: '#fff',
  },
  textarea: { height: 96, paddingTop: 14, paddingBottom: 14, textAlignVertical: 'top' },
  catWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catBtn: {
    height: 38, paddingHorizontal: 14, borderRadius: 999,
    borderWidth: 1, borderColor: C.line, backgroundColor: '#fff',
    justifyContent: 'center',
  },
  catBtnActive: { borderColor: C.black, backgroundColor: C.black },
  catLabel: { fontSize: 13, fontWeight: '600', color: C.text2 },
  catLabelActive: { color: '#fff' },
  durationWrap: { flexDirection: 'row', gap: 8 },
  durationBtn: {
    flex: 1, height: 44, borderRadius: 10,
    borderWidth: 1, borderColor: C.line, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  durationBtnActive: { borderColor: C.blue, backgroundColor: C.blueLow },
  durationLabel: { fontSize: 14, fontWeight: '600', color: C.text2 },
  durationLabelActive: { color: C.blue },
  colorWrap: { flexDirection: 'row', gap: 10 },
  colorBtn: {
    width: 44, height: 44, borderRadius: 12,
    borderWidth: 3, borderColor: 'transparent',
  },
  colorBtnActive: { borderColor: '#000' },
  footer: {
    borderTopWidth: 1, borderTopColor: C.line2,
    padding: 12, paddingHorizontal: 20, paddingBottom: 20,
  },
});
