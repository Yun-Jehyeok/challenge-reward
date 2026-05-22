import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRewardedAd } from '../../hooks/useRewardedAd';
import { toast } from '../../stores/toastStore';
import { C } from '../../constants/theme';

export default function AdScreen() {
  const router = useRouter();
  const { ticketId } = useLocalSearchParams<{ ticketId: string }>();
  const { loaded, rewarded, error, showAd } = useRewardedAd(ticketId);

  useEffect(() => {
    if (rewarded) {
      router.replace({ pathname: `/tickets/${ticketId}`, params: { unlocked: '1' } });
    }
  }, [rewarded]);

  useEffect(() => {
    if (error) {
      toast.error('광고를 끝까지 시청해야 복권을 열 수 있어요');
      router.back();
    }
  }, [error]);

  return (
    <View style={styles.container}>
      <View style={styles.adBar}>
        <Text style={styles.adLabel}>광고</Text>
      </View>

      <View style={styles.adContent}>
        {!loaded ? (
          <>
            <ActivityIndicator color="#fff" size="large" />
            <Text style={styles.loadingText}>광고를 불러오는 중이에요</Text>
          </>
        ) : (
          <>
            <View style={styles.adGraphic}>
              <Text style={styles.adEmoji}>📱</Text>
            </View>
            <Text style={styles.adTitle}>광고가 준비됐어요</Text>
            <Text style={styles.adSub}>광고를 끝까지 시청하면 복권을 긁을 수 있어요</Text>
            <Pressable onPress={showAd} style={styles.adCta}>
              <Text style={styles.adCtaLabel}>광고 시청하기</Text>
            </Pressable>
          </>
        )}
      </View>

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
  adContent: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18, paddingHorizontal: 24 },
  loadingText: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 12 },
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
