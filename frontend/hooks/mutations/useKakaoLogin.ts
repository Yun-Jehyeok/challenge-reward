import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { authApi } from '../../api/modules/auth';
import { useAuthStore } from '../../stores/authStore';

export function useKakaoLogin() {
  const { setTokens, setUser } = useAuthStore();

  return useMutation({
    mutationFn: ({ code, codeVerifier }: { code: string; codeVerifier?: string }) =>
      authApi.kakaoLogin(code, codeVerifier).then((res) => res.data),
    onSuccess: async (data) => {
      await setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      if (data.isNewUser) {
        router.replace('/(auth)/setup-nickname');
      } else {
        router.replace('/(tabs)');
      }
    },
  });
}
