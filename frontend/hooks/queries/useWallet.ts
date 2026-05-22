import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { walletApi } from '../../api/modules/wallet';
import { queryKeys } from '../../constants/queryKeys';

export function useWallet() {
  return useQuery({
    queryKey: queryKeys.wallet.all,
    queryFn: () => walletApi.getWallet().then((res) => res.data),
  });
}

export function useWalletTransactions() {
  return useInfiniteQuery({
    queryKey: queryKeys.wallet.transactions,
    queryFn: ({ pageParam }) =>
      walletApi.getTransactions(pageParam as string | undefined).then((res) => res.data),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextCursor ?? undefined : undefined),
  });
}
