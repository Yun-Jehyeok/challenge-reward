import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { C } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          {/* Logo */}
          <View style={styles.logoWrap}>
            <Text style={styles.logoIcon}>⬆</Text>
          </View>
          <Text style={styles.headline}>매일의 작은 실천이{'\n'}보상으로 돌아와요</Text>
          <Text style={styles.sub}>챌린지에 참여하고 인증하면{'\n'}복권과 함께 포인트가 쌓여요</Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={() => router.push('/(auth)/setup-nickname')}
            style={styles.kakaoBtn}
          >
            <Text style={styles.kakaoIcon}>💬</Text>
            <Text style={styles.kakaoBtnLabel}>카카오로 3초만에 시작</Text>
          </Pressable>

          <Text style={styles.terms}>
            시작하면{' '}
            <Text style={styles.termsLink}>이용약관</Text>
            {' '}및{' '}
            <Text style={styles.termsLink}>개인정보처리방침</Text>
            에 동의하게 돼요
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: C.blue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoIcon: {
    fontSize: 28,
    color: '#fff',
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: C.black,
    letterSpacing: -0.6,
    lineHeight: 38,
  },
  sub: {
    fontSize: 15,
    fontWeight: '500',
    color: C.text3,
    marginTop: 12,
    lineHeight: 24,
  },
  actions: {
    gap: 10,
  },
  kakaoBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FEE500',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  kakaoIcon: {
    fontSize: 20,
  },
  kakaoBtnLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(0,0,0,0.85)',
    letterSpacing: -0.04,
  },
  terms: {
    fontSize: 12,
    color: C.text3,
    textAlign: 'center',
    marginTop: 12,
  },
  termsLink: {
    color: C.text2,
    textDecorationLine: 'underline',
  },
});
