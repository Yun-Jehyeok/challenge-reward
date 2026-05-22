import { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppBar } from '../../components/ui/AppBar';
import { Button } from '../../components/ui/Button';
import { C } from '../../constants/theme';

const AMOUNTS = [1, 1, 1, 3, 3, 5, 10];
function pickAmount() { return AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)]; }

function ScratchOverlay({ onScratched }: { onScratched: () => void }) {
  const [revealed, setRevealed] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;

  const handleReveal = () => {
    if (revealed) return;
    setRevealed(true);
    Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
      onScratched();
    });
  };

  return (
    <Pressable onPress={handleReveal} style={styles.scratchOverlay}>
      <Animated.View style={[styles.scratchCover, { opacity }]}>
        <Text style={styles.scratchHint}>긁어서 확인하기</Text>
        <Text style={styles.scratchSub}>탭하여 열기</Text>
      </Animated.View>
    </Pressable>
  );
}

export default function TicketScratchScreen() {
  const router = useRouter();
  const { id, unlocked } = useLocalSearchParams<{ id: string; unlocked?: string }>();
  const [amount] = useState(pickAmount);
  const [revealed, setRevealed] = useState(false);

  // If not unlocked via ad, redirect to ad screen first
  if (!unlocked) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <AppBar title="복권" />
        <View style={styles.content}>
          <Text style={styles.from}>광고를 시청하면 복권을 긁을 수 있어요</Text>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 64 }}>🎫</Text>
          </View>
          <Button full onPress={() => router.push({ pathname: '/tickets/ad', params: { ticketId: id } })}>
            광고 시청하고 긁기
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <AppBar title="복권 긁기" />

      <View style={styles.content}>
        <Text style={styles.from}>하루 물 2L 마시기 인증으로 받은 복권</Text>

        {/* Scratch card */}
        <View style={styles.cardWrap}>
          {/* Reward behind */}
          <View style={styles.rewardBack}>
            <Text style={styles.rewardLabel}>축하합니다!</Text>
            <Text style={styles.rewardAmount}>{amount.toLocaleString()}<Text style={styles.rewardUnit}>원</Text></Text>
            <Text style={styles.rewardSub}>지갑에 적립됩니다</Text>
          </View>

          {/* Scratch overlay */}
          {!revealed && <ScratchOverlay onScratched={() => setRevealed(true)} />}
        </View>

        {/* Progress */}
        <View style={styles.progressRow}>
          <Text style={styles.progressLabel}>{revealed ? '완료!' : '탭해서 긁어주세요'}</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: revealed ? '100%' : '0%' }]} />
          </View>
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>복권 결과는 서버에서 결정돼요. 모든 복권에 당첨이 들어있어요.</Text>
        </View>

        <Button
          full
          disabled={!revealed}
          onPress={() => router.replace({ pathname: '/tickets/reward', params: { amount: String(amount) } })}
        >
          {revealed ? `${amount.toLocaleString()}원 지갑에 담기` : '먼저 복권을 긁어주세요'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, padding: 20, alignItems: 'center', gap: 16 },
  from: { fontSize: 13, color: C.text3, textAlign: 'center' },
  cardWrap: {
    width: 320, height: 200, borderRadius: 20,
    backgroundColor: '#FFF7E0',
    overflow: 'hidden',
    shadowColor: '#FF9200',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 28,
    elevation: 8,
  },
  rewardBack: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  rewardLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 0.4, color: '#D17600' },
  rewardAmount: { fontSize: 56, fontWeight: '800', color: '#FF5E00', letterSpacing: -1.5 },
  rewardUnit: { fontSize: 28, fontWeight: '700', marginLeft: 4 },
  rewardSub: { fontSize: 12, fontWeight: '600', letterSpacing: 0.3, color: C.text3 },
  scratchOverlay: { ...StyleSheet.absoluteFillObject },
  scratchCover: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#B8BAC0',
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  scratchHint: { fontSize: 14, fontWeight: '600', color: 'rgba(46,47,51,0.7)' },
  scratchSub: { fontSize: 11, color: 'rgba(46,47,51,0.5)' },
  progressRow: { width: '100%', gap: 6 },
  progressLabel: { fontSize: 12, color: C.text3, letterSpacing: 0.3 },
  progressTrack: { width: '100%', height: 4, borderRadius: 999, backgroundColor: C.line2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FF5E00', borderRadius: 999 },
  infoCard: {
    width: '100%', padding: 14, borderRadius: 12, backgroundColor: C.bg3,
  },
  infoText: { fontSize: 13, color: C.text2, lineHeight: 20, textAlign: 'center' },
});
