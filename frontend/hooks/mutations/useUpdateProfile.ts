import { useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../../api/modules/users';
import { uploadsApi } from '../../api/modules/uploads';
import { uploadToS3 } from '../../utils/upload';
import { useAuthStore } from '../../stores/authStore';

interface UpdateProfileInput {
  nickname?: string;
  imageUri?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: async ({ nickname, imageUri }: UpdateProfileInput) => {
      let profileImageKey: string | undefined;

      if (imageUri) {
        const { data } = await uploadsApi.getPresignedUrl('profile', 'image/jpeg');
        await uploadToS3(data.presignedUrl, imageUri, 'image/jpeg');
        profileImageKey = data.fileKey;
      }

      return usersApi.updateMe({ nickname, profileImageKey }).then((res) => res.data);
    },
    onSuccess: (user) => {
      setUser({ id: user.id, nickname: user.nickname, profileImageUrl: user.profileImageUrl });
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}
