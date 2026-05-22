import { useQuery } from '@tanstack/react-query';
import { challengesApi } from '../../api/modules/challenges';
import { queryKeys } from '../../constants/queryKeys';

export function useChallenge(id: string) {
  return useQuery({
    queryKey: queryKeys.challenges.detail(id),
    queryFn: () => challengesApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}
