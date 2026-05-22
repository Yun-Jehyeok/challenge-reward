import { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PhotoPlaceholder } from '../../components/ui/PhotoPlaceholder';
import { Chip } from '../../components/ui/Chip';
import { C } from '../../constants/theme';

const CATEGORIES = ['전체', '운동', '공부', '생활습관', '자기계발', '갓생', '건강'];

const POPULAR = [
  { id: 'p1', title: '100일 코딩 챌린지', creator: '민준', participants: 1284, seed: 'code', category: '자기계발', period: '100일' },
  { id: 'p2', title: '주 3회 홈트레이닝', creator: '하늘 PT', participants: 832, seed: 'fit', category: '운동', period: '4주' },
  { id: 'p3', title: '하루 한 끼 식단 사진', creator: '영양사 수민', participants: 567, seed: 'meal', category: '건강', period: '21일' },
  { id: 'p4', title: '매일 영어 단어 10개', creator: '잉글리시', participants: 921, seed: 'eng', category: '공부', period: '30일' },
  { id: 'p5', title: '주말 등산 인증', creator: '산악회', participants: 142, seed: 'hike', category: '운동', period: '12주' },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [cat, setCat] = useState('전체');
  const [search, setSearch] = useState('');

  const filtered = POPULAR.filter(
    (p) => (cat === '전체' || p.category === cat) && p.title.includes(search),
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headline}>탐색</Text>
          <View style={styles.searchWrap}>
            <Ionicons name="search-outline" size={18} color={C.text3} style={styles.searchIcon} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="챌린지 검색"
              placeholderTextColor={C.text3}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Category filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
          {CATEGORIES.map((c) => (
            <Pressable
              key={c}
              onPress={() => setCat(c)}
              style={[styles.catBtn, cat === c && styles.catBtnActive]}
            >
              <Text style={[styles.catLabel, cat === c && styles.catLabelActive]}>{c}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* List */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>인기 챌린지</Text>
          <View style={styles.sortRow}>
            <Ionicons name="options-outline" size={14} color={C.text3} />
            <Text style={styles.sortLabel}>인기순</Text>
          </View>
        </View>

        <View style={styles.list}>
          {filtered.map((p) => (
            <Pressable key={p.id} onPress={() => router.push(`/challenges/${p.id}`)} style={styles.listItem}>
              <PhotoPlaceholder seed={p.seed} style={styles.listImg} />
              <View style={styles.listInfo}>
                <Chip size="xs" variant="neutral">{p.category}</Chip>
                <Text style={styles.listTitle2}>{p.title}</Text>
                <Text style={styles.listMeta}>{p.creator} · {p.period}</Text>
                <View style={styles.participantRow}>
                  <Ionicons name="person-outline" size={12} color={C.text3} />
                  <Text style={styles.participantText}>{p.participants.toLocaleString()}명 참여 중</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* FAB */}
      <Pressable onPress={() => router.push('/challenges/create')} style={styles.fab}>
        <Ionicons name="add" size={24} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  scroll: { flex: 1 },
  header: { padding: 20, paddingBottom: 12 },
  headline: { fontSize: 24, fontWeight: '800', color: C.black, letterSpacing: -0.5 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.line,
    backgroundColor: C.bg2,
    paddingLeft: 42,
    paddingRight: 14,
  },
  searchIcon: { position: 'absolute', left: 14 },
  searchInput: { flex: 1, fontSize: 15, color: C.black },
  catScroll: { marginBottom: 4 },
  catContent: { gap: 6, paddingHorizontal: 20, paddingVertical: 8 },
  catBtn: {
    height: 34, paddingHorizontal: 14, borderRadius: 999,
    borderWidth: 1, borderColor: C.line, backgroundColor: '#fff',
    justifyContent: 'center',
  },
  catBtnActive: { borderColor: C.black, backgroundColor: C.black },
  catLabel: { fontSize: 13, fontWeight: '600', color: C.text2 },
  catLabelActive: { color: '#fff' },
  listHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 12,
  },
  listTitle: { fontSize: 16, fontWeight: '700', color: C.black },
  sortRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sortLabel: { fontSize: 12, color: C.text3 },
  list: { gap: 16, paddingHorizontal: 20 },
  listItem: { flexDirection: 'row', gap: 14 },
  listImg: { width: 100, height: 100, borderRadius: 14, flexShrink: 0 },
  listInfo: { flex: 1, paddingTop: 2, gap: 4 },
  listTitle2: { fontSize: 15, fontWeight: '600', color: C.black },
  listMeta: { fontSize: 13, color: C.text3 },
  participantRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  participantText: { fontSize: 12, fontWeight: '600', color: C.text2 },
  fab: {
    position: 'absolute',
    right: 16, bottom: 88,
    width: 56, height: 56, borderRadius: 999,
    backgroundColor: C.black,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 24,
    elevation: 8,
  },
});
