import { View, StyleSheet } from 'react-native';
import { Button } from '../ui/Button';

interface VoteButtonsProps {
  onApprove: () => void;
  onReject: () => void;
  disabled?: boolean;
}

export function VoteButtons({ onApprove, onReject, disabled }: VoteButtonsProps) {
  return (
    <View style={styles.container}>
      <Button variant="negative" size="lg" style={styles.btn} disabled={disabled} onPress={onReject}>
        거부
      </Button>
      <Button size="lg" style={styles.btn} disabled={disabled} onPress={onApprove}>
        승인
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1 },
});
