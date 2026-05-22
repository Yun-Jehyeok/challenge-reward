import { useQuery } from '@tanstack/react-query';
import { proofsApi } from '../../api/modules/proofs';
import { queryKeys } from '../../constants/queryKeys';

export function useProof(id: string) {
  return useQuery({
    queryKey: queryKeys.proofs.detail(id),
    queryFn: () => proofsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
}
