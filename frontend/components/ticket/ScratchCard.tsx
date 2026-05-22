import { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { C } from '../../constants/theme';

interface ScratchCardProps {
  rewardAmount: number | null;
  isReady: boolean;
  onScratched: () => void;
}

export function ScratchCard({ rewardAmount, isReady, onScratched }: ScratchCardProps) {
  const [revealed, setRevealed] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;

  const handleReveal = () => {
    if (revealed || !isReady) return;
    setRevealed(true);
    Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
      onScratched();
    });
  };

  return (
    <View style={styles.cardWrap}>
      <View style={styles.rewardBack}>
        <Text style={styles.rewardLabel}>축하합니다!</Text>
        <Text style={styles.rewardAmount}>
          {rewardAmount != null ? rewardAmount.toLocaleString() : '?'}
          <Text style={styles.rewardUnit}>원</Text>
        </Text>
        <Text style={styles.rewardSub}>지갑에 적립됩니다</Text>
      </View>

      {!revealed && isReady && (
        <Pressable onPress={handleReveal} style={styles.scratchOverlay}>
          <Animated.View style={[styles.scratchCover, { opacity }]}>
            <Text style={styles.scratchHint}>긁어서 확인하기</Text>
            <Text style={styles.scratchSub}>탭하여 열기</Text>
          </Animated.View>
        </Pressable>
      )}

      {!isReady && (
        <View style={styles.scratchOverlay}>
          <View style={[styles.scratchCover, { opacity: 1 }]}>
            <Text style={styles.scratchHint}>광고 시청 후 긁을 수 있어요</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
  rewardBack: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: 8 },
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
});
