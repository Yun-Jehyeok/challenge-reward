import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { useSetupNickname } from '../../hooks/mutations/useSetupNickname';
import { toast } from '../../stores/toastStore';
import { C } from '../../constants/theme';

export default function SetupNicknameScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const ok = name.trim().length >= 2 && name.trim().length <= 10;

  const { mutate, isPending } = useSetupNickname();

  const handleSubmit = () => {
    if (!ok) return;
    mutate(name.trim(), {
      onError: () => toast.error('닉네임 설정에 실패했어요. 다시 시도해주세요.'),
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.appBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={C.black} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Text style={styles.headline}>어떻게 불러드릴까요?</Text>
        <Text style={styles.sub}>닉네임은 다른 참여자에게 보여요</Text>

        <Text style={styles.fieldLabel}>닉네임</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="2~10자로 입력해주세요"
          placeholderTextColor={C.text3}
          maxLength={10}
          style={[styles.input, name.length > 0 && styles.inputFocused]}
          autoFocus
        />
        <View style={styles.hint}>
          <Text style={styles.hintText}>한글, 영문, 숫자 입력 가능</Text>
          <Text style={styles.hintText}>{name.length}/10</Text>
        </View>

        <View style={styles.spacer} />
        <Button full disabled={!ok || isPending} onPress={handleSubmit}>
          {isPending ? <ActivityIndicator color="#fff" size="small" /> : '시작하기'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  appBar: {
    height: 56,
    paddingHorizontal: 4,
    justifyContent: 'center',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headline: {
    fontSize: 26,
    fontWeight: '700',
    color: C.black,
    letterSpacing: -0.6,
    marginTop: 20,
  },
  sub: {
    fontSize: 15,
    color: C.text3,
    marginTop: 8,
    marginBottom: 32,
    lineHeight: 24,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: C.text2,
    marginBottom: 8,
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.line,
    fontSize: 16,
    color: C.black,
    backgroundColor: '#fff',
  },
  inputFocused: {
    borderColor: C.blue,
  },
  hint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  hintText: {
    fontSize: 12,
    color: C.text3,
  },
  spacer: { flex: 1 },
});
