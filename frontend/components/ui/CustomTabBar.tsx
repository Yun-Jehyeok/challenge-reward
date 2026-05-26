import { View, Text, Pressable, StyleSheet, Animated, Platform } from 'react-native';
import { useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { C } from '../../constants/theme';

type Tab = { id: string; label: string; icon: keyof typeof Ionicons.glyphMap; iconFill: keyof typeof Ionicons.glyphMap };

const TABS: Tab[] = [
  { id: 'index', label: '홈', icon: 'home-outline', iconFill: 'home' },
  { id: 'explore', label: '탐색', icon: 'search-outline', iconFill: 'search' },
  { id: 'tickets', label: '복권함', icon: 'bookmark-outline', iconFill: 'bookmark' },
  { id: 'profile', label: '프로필', icon: 'person-outline', iconFill: 'person' },
];

interface Props {
  state: { index: number; routes: { name: string }[] };
  descriptors: Record<string, { options: { title?: string } }>;
  navigation: { emit: (e: { type: string; target?: string; canPreventDefault?: boolean }) => { defaultPrevented: boolean }; navigate: (name: string) => void };
}

function TabItem({ tab, isActive, onPress }: { tab: Tab; isActive: boolean; onPress: () => void }) {
  const anim = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: isActive ? 1 : 0, duration: 280, useNativeDriver: false }).start();
  }, [isActive]);

  const flexAnim = anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] });
  const bgAnim = anim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,1)'] });

  return (
    <Animated.View style={{ flex: flexAnim }}>
      <Pressable onPress={onPress} style={styles.tabItem}>
        <Animated.View style={[styles.tabInner, { backgroundColor: bgAnim as any }]}>
          <Ionicons
            name={isActive ? tab.iconFill : tab.icon}
            size={20}
            color={isActive ? '#fff' : C.neutral}
          />
          {isActive && (
            <Text style={styles.tabLabel}>{tab.label}</Text>
          )}
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export function CustomTabBar({ state, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === 'android' && insets.bottom === 0 ? 48 : insets.bottom;

  return (
    <View style={[styles.wrapper, { paddingBottom: bottomInset + 8 }]}>
      <View style={styles.pill}>
        {TABS.map((tab, i) => {
          const route = state.routes[i];
          const isActive = state.index === i;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route?.key, canPreventDefault: true });
            if (!isActive && !event.defaultPrevented) {
              navigation.navigate(tab.id);
            }
          };

          return <TabItem key={tab.id} tab={tab} isActive={isActive} onPress={onPress} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 14,
    paddingTop: 8,
    backgroundColor: 'transparent',
  },
  pill: {
    flexDirection: 'row',
    gap: 4,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: C.line,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 22,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
  },
  tabInner: {
    height: 46,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    overflow: 'hidden',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.05,
  },
});
