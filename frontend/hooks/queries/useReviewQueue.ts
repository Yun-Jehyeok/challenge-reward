import { useInfiniteQuery } from '@tanstack/react-query';
import { proofsApi } from '../../api/modules/proofs';
import { queryKeys } from '../../constants/queryKeys';

export function useReviewQueue() {
  return useInfiniteQuery({
    queryKey: queryKeys.proofs.reviewQueue,
    queryFn: ({ pageParam }) =>
      proofsApi.getReviewQueue(pageParam as string | undefined).then((res) => res.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined),
  });
}
