import { useQuery } from '@tanstack/react-query';
import { challengesApi } from '../../api/modules/challenges';
import { queryKeys } from '../../constants/queryKeys';

export function useMyChallenges() {
  return useQuery({
    queryKey: queryKeys.challenges.my,
    queryFn: () => challengesApi.getMy().then((res) => res.data.data),
  });
}
