import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppBar } from '../components/ui/AppBar';
import { Toggle } from '../components/ui/Toggle';
import { useMe } from '../hooks/queries/useMe';
import { useAuthStore } from '../stores/authStore';
import { usersApi } from '../api/modules/users';
import { toast } from '../stores/toastStore';
import { C } from '../constants/theme';

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupLabel}>{label}</Text>
      <View style={styles.groupCard}>{children}</View>
    </View>
  );
}

function Row({ label, sub, detail, trailing, chevron, isLast, onPress }: {
  label: string; sub?: string; detail?: string; trailing?: React.ReactNode;
  chevron?: boolean; isLast?: boolean; onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.row, !isLast && styles.rowBorder]}>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sub ? <Text style={styles.rowSub}>{sub}</Text> : null}
      </View>
      {detail ? <Text style={styles.rowDetail}>{detail}</Text> : null}
      {trailing ?? null}
      {chevron && <Ionicons name="chevron-forward" size={14} color={C.text4} />}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { data: me } = useMe();
  const { clearAuth } = useAuthStore();
  const [push, setPush] = useState(true);
  const [marketing, setMarketing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const handleLogout = () => {
    Alert.alert('로그아웃', '정말 로그아웃 하시겠어요?', [
      { text: '취소', style: 'cancel' },
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await clearAuth();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  const handleWithdraw = () => {
    Alert.alert(
      '회원 탈퇴',
      '탈퇴하면 모든 데이터가 삭제돼요. 정말 탈퇴하시겠어요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '탈퇴하기',
          style: 'destructive',
          onPress: async () => {
            setWithdrawing(true);
            try {
              await usersApi.deleteMe();
              await clearAuth();
              router.replace('/(auth)/login');
            } catch {
              toast.error('탈퇴 처리에 실패했어요');
            } finally {
              setWithdrawing(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppBar title="설정" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Group label="알림">
          <Row label="푸시 알림" trailing={<Toggle value={push} onValueChange={setPush} />} />
          <Row label="마케팅 알림" sub="새 챌린지·이벤트" trailing={<Toggle value={marketing} onValueChange={setMarketing} />} isLast />
        </Group>

        <Group label="계정">
          <Row label="닉네임" detail={me?.nickname ?? ''} chevron onPress={() => router.push('/(auth)/setup-nickname')} />
          <Row label="로그아웃" chevron onPress={handleLogout} isLast />
        </Group>

        <Group label="이용 정보">
          <Row label="이용약관" chevron />
          <Row label="개인정보처리방침" chevron />
          <Row label="복권 당첨 확률" chevron />
          <Row label="버전" detail="0.1.0 (MVP)" isLast />
        </Group>

        <Pressable style={styles.withdraw} onPress={handleWithdraw} disabled={withdrawing}>
          {withdrawing
            ? <ActivityIndicator color={C.text3} size="small" />
            : <Text style={styles.withdrawLabel}>회원 탈퇴</Text>
          }
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg2 },
  content: { padding: 20, paddingBottom: 40 },
  group: { marginTop: 20 },
  groupLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3, color: C.text3, paddingLeft: 4, paddingBottom: 8 },
  groupCard: {
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: C.line, overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14, minHeight: 48,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.line2 },
  rowContent: { flex: 1 },
  rowLabel: { fontSize: 15, color: C.black },
  rowSub: { fontSize: 12, color: C.text3, marginTop: 2 },
  rowDetail: { fontSize: 13, color: C.text3 },
  withdraw: { marginTop: 12, padding: 14, borderRadius: 12, alignItems: 'center' },
  withdrawLabel: { fontSize: 13, color: C.text3 },
});
