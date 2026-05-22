import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const AD_DURATION = 5;

export default function AdScreen() {
  const router = useRouter();
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  const [seconds, setSeconds] = useState(AD_DURATION);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const done = seconds <= 0;

  return (
    <View style={styles.container}>
      {/* Ad bar */}
      <View style={styles.adBar}>
        <Text style={styles.adLabel}>광고</Text>
        <Pressable
          onPress={() => done && router.replace({ pathname: `/tickets/${ticketId}`, params: { unlocked: '1' } })}
          style={[styles.skipBtn, done && styles.skipBtnActive]}
        >
          <Text style={[styles.skipLabel, done && styles.skipLabelActive]}>
            {done ? '건너뛰기 ›' : `${seconds}초 후 건너뛰기`}
          </Text>
        </Pressable>
      </View>

      {/* Ad content */}
      <View style={styles.adContent}>
        <View style={styles.adGraphic}>
          <Text style={styles.adEmoji}>📱</Text>
        </View>
        <Text style={styles.adTitle}>새로운 게임이 출시되었어요</Text>
        <Text style={styles.adSub}>지금 다운로드하면 캐시 5,000원 즉시 지급</Text>
        <Pressable style={styles.adCta}>
          <Text style={styles.adCtaLabel}>지금 설치하기</Text>
        </Pressable>
      </View>

      {/* Bottom hint */}
      <Text style={styles.hint}>광고를 끝까지 보면 복권을 긁을 수 있어요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  adBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8,
  },
  adLabel: { fontSize: 12, fontWeight: '600', letterSpacing: 0.4, color: '#fff' },
  skipBtn: {
    height: 32, paddingHorizontal: 12, borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  skipBtnActive: { backgroundColor: '#fff' },
  skipLabel: { fontSize: 12, fontWeight: '600', color: '#fff' },
  skipLabelActive: { color: '#000' },
  adContent: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    gap: 18, paddingHorizontal: 24,
  },
  adGraphic: {
    width: 240, height: 240, borderRadius: 24,
    backgroundColor: '#0066FF',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#6541F2',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4, shadowRadius: 40, elevation: 12,
  },
  adEmoji: { fontSize: 56 },
  adTitle: { fontSize: 22, fontWeight: '700', color: '#fff', textAlign: 'center', letterSpacing: -0.4 },
  adSub: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', lineHeight: 22 },
  adCta: {
    marginTop: 12, height: 44, paddingHorizontal: 24, borderRadius: 999,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
  },
  adCtaLabel: { fontSize: 14, fontWeight: '700', color: '#000' },
  hint: {
    paddingHorizontal: 20, paddingBottom: 24, paddingTop: 14,
    fontSize: 12, color: 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 20,
  },
});
