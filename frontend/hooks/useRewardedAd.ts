import { useState, useEffect, useCallback } from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';

const AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : (process.env.EXPO_PUBLIC_ADMOB_REWARDED_AD_UNIT_ID ?? TestIds.REWARDED);

export function useRewardedAd(ticketId: string) {
  const [loaded, setLoaded] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const [error, setError] = useState(false);

  const ad = RewardedAd.createForAdRequest(AD_UNIT_ID, {
    customData: ticketId,
  });

  useEffect(() => {
    const unsubLoad = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setLoaded(true);
    });
    const unsubEarned = ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
      setRewarded(true);
    });
    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      setError(true);
    });

    ad.load();

    return () => {
      unsubLoad();
      unsubEarned();
      unsubError();
    };
  }, [ticketId]);

  const showAd = useCallback(() => {
    if (loaded) ad.show();
  }, [loaded]);

  return { loaded, rewarded, error, showAd };
}
