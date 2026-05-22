import { useMutation, useQueryClient } from '@tanstack/react-query';
import { proofsApi, VoteType } from '../../api/modules/proofs';
import { queryKeys } from '../../constants/queryKeys';

export function useVoteProof(proofId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vote: VoteType) => proofsApi.vote(proofId, vote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.proofs.reviewQueue });
      queryClient.invalidateQueries({ queryKey: queryKeys.proofs.reviewQueueCount });
    },
  });
}
