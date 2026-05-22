import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { useAuthStore } from '../stores/authStore';
import { usersApi } from '../api/modules/users';
import { Toast } from '../components/ui/Toast';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 },
  },
});

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { accessToken, user, loadFromStorage, setUser } = useAuthStore();
  const [initialized, setInitialized] = useState(false);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    loadFromStorage().then(() => setInitialized(true));
  }, []);

  useEffect(() => {
    if (!accessToken || user) return;
    usersApi.getMe().then((res) => {
      setUser(res.data);
    }).catch(() => {});
  }, [accessToken, user]);

  useEffect(() => {
    if (!accessToken) return;
    registerFcmToken();
  }, [accessToken]);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {});

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      if (data?.type === 'ticket') {
        router.push('/(tabs)/tickets');
      }
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;
    if (accessToken && !user) return; // 유저 fetch 대기
    const inAuth = segments[0] === '(auth)';
    if (!accessToken && !inAuth) {
      router.replace('/(auth)/login');
    } else if (accessToken && !user?.nickname && segments[1] !== 'setup-nickname') {
      router.replace('/(auth)/setup-nickname');
    } else if (accessToken && user?.nickname && inAuth && segments[1] !== 'setup-nickname') {
      router.replace('/(tabs)');
    }
  }, [accessToken, user, segments, initialized]);

  return <Slot />;
}

async function registerFcmToken() {
  if (Platform.OS === 'web') return;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return;

  const token = await Notifications.getExpoPushTokenAsync();
  if (token.data) {
    await usersApi.updateFcmToken(token.data).catch(() => {});
  }
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthGate />
        <Toast />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
