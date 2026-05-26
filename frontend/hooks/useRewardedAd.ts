import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const AD_UNIT_ID = Platform.select({
  android: process.env.EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID ?? TestIds.REWARDED,
  default: TestIds.REWARDED,
});

export function useRewardedAd(ticketId: string) {
  const [loaded, setLoaded] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const [error, setError] = useState(false);
  const adRef = useRef<RewardedAd | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const ad = RewardedAd.createForAdRequest(AD_UNIT_ID, {
      customData: ticketId,
    });
    adRef.current = ad;

    const unsubscribeLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });

    const unsubscribeEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => setRewarded(true),
    );

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, () => {
      setError(true);
    });

    ad.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeError();
    };
  }, [ticketId]);

  const showAd = useCallback(() => {
    if (Platform.OS === 'web') {
      setRewarded(true);
      return;
    }
    adRef.current?.show();
  }, []);

  return { loaded, rewarded, error, showAd };
}
