import { useMutation, useQueryClient } from '@tanstack/react-query';
import { challengesApi } from '../../api/modules/challenges';
import { queryKeys } from '../../constants/queryKeys';

export function useJoinChallenge(challengeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => challengesApi.join(challengeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.detail(challengeId) });
    },
  });
}
