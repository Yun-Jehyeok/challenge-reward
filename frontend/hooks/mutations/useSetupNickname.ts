import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { usersApi } from '../../api/modules/users';
import { useAuthStore } from '../../stores/authStore';

export function useSetupNickname() {
  const { setUser } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (nickname: string) => usersApi.updateMe({ nickname }).then((res) => res.data),
    onSuccess: (user) => {
      setUser({ id: user.id, nickname: user.nickname, profileImageUrl: user.profileImageUrl });
      router.replace('/(tabs)');
    },
  });
}
