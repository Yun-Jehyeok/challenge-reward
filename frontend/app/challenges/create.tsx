import { useState } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar } from '../../components/ui/AppBar';
import { Button } from '../../components/ui/Button';
import { useCreateChallenge } from '../../hooks/mutations/useCreateChallenge';
import { toast } from '../../stores/toastStore';
import { toKstDateString } from '../../utils/date';
import { C } from '../../constants/theme';

const DURATIONS = [7, 14, 21, 30, 60, 100];

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

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
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [days, setDays] = useState(30);
  const [maxPpl, setMaxPpl] = useState('');

  const { mutate, isPending } = useCreateChallenge();

  const ok = title.trim().length >= 2;

  const handleSubmit = () => {
    if (!ok) return;
    const startDate = toKstDateString();
    const endDate = addDays(startDate, days);
    const maxParticipants = maxPpl.trim() ? parseInt(maxPpl.trim(), 10) : null;

    mutate(
      { title: title.trim(), description: desc.trim(), startDate, endDate, maxParticipants },
      {
        onSuccess: () => toast.success('챌린지가 시작됐어요!'),
        onError: () => toast.error('챌린지 생성에 실패했어요'),
      },
    );
  };

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
            placeholder="어떤 사진을 올려야 하는지도 적어주면 좋아요."
            placeholderTextColor={C.text3}
            maxLength={200}
            multiline
            style={[styles.input, styles.textarea]}
          />
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

        <Field label="최대 인원" hint="비워두면 무제한">
          <TextInput
            value={maxPpl}
            onChangeText={setMaxPpl}
            keyboardType="number-pad"
            placeholder="예: 100"
            placeholderTextColor={C.text3}
            style={[styles.input, { textAlign: 'right' }]}
          />
        </Field>
      </ScrollView>

      <View style={styles.footer}>
        <Button full disabled={!ok || isPending} onPress={handleSubmit}>
          {isPending ? <ActivityIndicator color="#fff" size="small" /> : '챌린지 시작하기'}
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
  durationWrap: { flexDirection: 'row', gap: 8 },
  durationBtn: {
    flex: 1, height: 44, borderRadius: 10,
    borderWidth: 1, borderColor: C.line, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  durationBtnActive: { borderColor: C.blue, backgroundColor: C.blueLow },
  durationLabel: { fontSize: 14, fontWeight: '600', color: C.text2 },
  durationLabelActive: { color: C.blue },
  footer: {
    borderTopWidth: 1, borderTopColor: C.line2,
    padding: 12, paddingHorizontal: 20, paddingBottom: 20,
  },
});
