import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { challengesApi, CreateChallengeDto } from '../../api/modules/challenges';
import { queryKeys } from '../../constants/queryKeys';

export function useCreateChallenge() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChallengeDto) => challengesApi.create(data).then((res) => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.all });
      router.replace(`/challenges/${data.challenge.id}`);
    },
  });
}
