import { useState, useCallback } from 'react';
import { Platform } from 'react-native';

// TODO: AdMob 작업 시 react-native-google-mobile-ads 복구
// - app.json plugins에 react-native-google-mobile-ads 플러그인 추가
// - 아래 스텁 코드를 원래 구현으로 교체

export function useRewardedAd(_ticketId: string) {
  const [rewarded, setRewarded] = useState(false);

  const showAd = useCallback(() => {
    if (Platform.OS === 'web') {
      // web 테스트용: 광고 없이 즉시 rewarded 처리
      setRewarded(true);
    }
  }, []);

  return { loaded: Platform.OS === 'web', rewarded, error: false, showAd };
}
