import { useQuery } from '@tanstack/react-query';
import { proofsApi } from '../../api/modules/proofs';
import { queryKeys } from '../../constants/queryKeys';

export function useReviewQueueCount() {
  return useQuery({
    queryKey: queryKeys.proofs.reviewQueueCount,
    queryFn: () => proofsApi.getReviewQueueCount().then((res) => res.data.count),
  });
}
