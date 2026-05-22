import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { authApi } from '../../api/modules/auth';
import { useAuthStore } from '../../stores/authStore';

export function useKakaoLogin() {
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: (code: string) => authApi.kakaoLogin(code).then((res) => res.data),
    onSuccess: async (data) => {
      await setTokens(data.accessToken, data.refreshToken);
      if (data.isNewUser) {
        router.replace('/(auth)/setup-nickname');
      } else {
        router.replace('/(tabs)');
      }
    },
  });
}
