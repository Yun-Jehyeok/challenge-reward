import { useInfiniteQuery } from '@tanstack/react-query';
import { challengesApi } from '../../api/modules/challenges';
import { queryKeys } from '../../constants/queryKeys';

export function useChallenges(keyword?: string) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.challenges.all, { keyword }],
    queryFn: ({ pageParam }) =>
      challengesApi.getList({ cursor: pageParam as string | undefined, keyword }).then((res) => res.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined),
  });
}
