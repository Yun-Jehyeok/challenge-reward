import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 },
  },
});

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { accessToken, user } = useAuthStore();

  useEffect(() => {
    const inAuth = segments[0] === '(auth)';

    if (!accessToken && !inAuth) {
      router.replace('/(auth)/login');
    } else if (accessToken && !user?.nickname && segments[1] !== 'setup-nickname') {
      router.replace('/(auth)/setup-nickname');
    } else if (accessToken && user?.nickname && inAuth) {
      router.replace('/(tabs)');
    }
  }, [accessToken, user, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthGate />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
