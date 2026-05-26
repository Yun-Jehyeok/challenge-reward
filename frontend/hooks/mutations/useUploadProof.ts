import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { proofsApi } from '../../api/modules/proofs';
import { uploadsApi } from '../../api/modules/uploads';
import { uploadToS3 } from '../../utils/upload';
import { queryKeys } from '../../constants/queryKeys';

interface UploadProofInput {
  imageUri: string;
  comment?: string;
}

export function useUploadProof(challengeId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ imageUri, comment }: UploadProofInput) => {
      const { data } = await uploadsApi.getPresignedUrl('proof', 'image/jpeg');
      await uploadToS3(data.presignedUrl, imageUri, 'image/jpeg');
      return proofsApi.create(challengeId, { imageKey: data.fileKey, comment }).then((res) => res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.challenges.detail(challengeId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.tickets.all });
      router.replace('/(tabs)');
    },
  });
}
