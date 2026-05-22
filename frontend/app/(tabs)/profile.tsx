import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../../components/ui/Avatar';
import { C } from '../../constants/theme';

const USER = { nickname: '지수', streak: 7, totalProofs: 23, points: 1284, joinedAt: '2026.03.14' };

function BigStat({ label, value, unit, color }: { label: string; value: string | number; unit: string; color: string }) {
  return (
    <View style={styles.bigStat}>
      <Text style={styles.bigStatLabel}>{label}</Text>
      <Text style={styles.bigStatValue}>
        <Text style={{ color: C.black }}>{value}</Text>
        <Text style={styles.bigStatUnit}>{unit}</Text>
      </Text>
    </View>
  );
}

function MenuRow({ icon, label, detail, onPress, isLast }: {
  icon: keyof typeof Ionicons.glyphMap; label: string; detail?: string; onPress?: () => void; isLast?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.menuRow, isLast ? null : styles.menuRowBorder]}
    >
      <Ionicons name={icon} size={20} color={C.neutral} />
      <Text style={styles.menuLabel}>{label}</Text>
      {detail ? <Text style={styles.menuDetail}>{detail}</Text> : null}
      <Ionicons name="chevron-forward" size={14} color={C.text4} />
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.headline}>프로필</Text>
            <Pressable onPress={() => router.push('/settings')} style={styles.settingBtn}>
              <Ionicons name="settings-outline" size={18} color={C.black} />
            </Pressable>
          </View>

          <View style={styles.profileRow}>
            <Avatar name={USER.nickname} size={64} />
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{USER.nickname}</Text>
              <Text style={styles.profileJoined}>{USER.joinedAt} 가입</Text>
            </View>
            <Pressable style={styles.editBtn}>
              <Text style={styles.editBtnLabel}>편집</Text>
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <BigStat label="현재 streak" value={USER.streak} unit="일" color={C.coral} />
            <BigStat label="누적 인증" value={USER.totalProofs} unit="회" color={C.blue} />
            <BigStat label="포인트" value={USER.points.toLocaleString()} unit="원" color={C.green} />
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menuSection}>
          <View style={styles.menuCard}>
            <MenuRow icon="star-outline" label="내가 만든 챌린지" detail="2" onPress={() => router.push('/(tabs)/explore')} />
            <MenuRow icon="document-text-outline" label="지갑 · 거래내역" detail={`${USER.points.toLocaleString()}원`} onPress={() => router.push('/wallet')} />
            <MenuRow icon="notifications-outline" label="알림 설정" onPress={() => router.push('/settings')} />
            <MenuRow icon="chatbubble-outline" label="문의하기" />
            <MenuRow icon="document-outline" label="공지사항" />
            <MenuRow icon="settings-outline" label="설정" onPress={() => router.push('/settings')} isLast />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg2 },
  header: { backgroundColor: '#fff', padding: 20, paddingBottom: 24 },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headline: { fontSize: 24, fontWeight: '800', color: C.black, letterSpacing: -0.5 },
  settingBtn: {
    width: 40, height: 40, borderRadius: 12,
    borderWidth: 1, borderColor: C.line,
    alignItems: 'center', justifyContent: 'center',
  },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 20 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: '700', letterSpacing: -0.2, color: C.black },
  profileJoined: { fontSize: 13, color: C.text3, marginTop: 2 },
  editBtn: {
    height: 32, paddingHorizontal: 12, borderRadius: 8,
    borderWidth: 1, borderColor: C.line, backgroundColor: '#fff',
    justifyContent: 'center',
  },
  editBtnLabel: { fontSize: 12, fontWeight: '600', color: C.black },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 20,
  },
  bigStat: { flex: 1, padding: 14, borderRadius: 14, backgroundColor: C.bg3 },
  bigStatLabel: { fontSize: 11, letterSpacing: 0.3, color: C.text3 },
  bigStatValue: { marginTop: 6, fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  bigStatUnit: { fontSize: 13, fontWeight: '600', color: C.text3, marginLeft: 2 },
  menuSection: { padding: 20, paddingBottom: 32 },
  menuCard: {
    backgroundColor: '#fff', borderRadius: 14,
    borderWidth: 1, borderColor: C.line, overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  menuRowBorder: { borderBottomWidth: 1, borderBottomColor: C.line2 },
  menuLabel: { flex: 1, fontSize: 15, color: C.black },
  menuDetail: { fontSize: 13, color: C.text3 },
});
