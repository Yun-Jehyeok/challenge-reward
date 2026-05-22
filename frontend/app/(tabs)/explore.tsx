import { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Chip } from '../../components/ui/Chip';
import { Empty } from '../../components/ui/Empty';
import { useChallenges } from '../../hooks/queries/useChallenges';
import { ChallengeSummary } from '../../api/modules/challenges';
import { C } from '../../constants/theme';

const COVER_COLORS = ['#00AEFF', '#FF9200', '#6541F2', '#FF5E00', '#00BF40', '#0066FF'];
function coverColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return COVER_COLORS[h % COVER_COLORS.length];
}

function ChallengeItem({ item }: { item: ChallengeSummary }) {
  const router = useRouter();
  const color = coverColor(item.id);

  return (
    <Pressable onPress={() => router.push(`/challenges/${item.id}`)} style={styles.listItem}>
      <View style={[styles.listAvatar, { backgroundColor: color }]}>
        <Text style={styles.listAvatarText}>{item.title[0]}</Text>
      </View>
      <View style={styles.listInfo}>
        {item.isEnded && <Chip size="xs" variant="neutral">종료</Chip>}
        {item.isJoined && !item.isEnded && <Chip size="xs" variant="positive">참여 중</Chip>}
        <Text style={styles.listTitle}>{item.title}</Text>
        <Text style={styles.listMeta}>{item.startDate} ~ {item.endDate}</Text>
        <View style={styles.participantRow}>
          <Ionicons name="person-outline" size={12} color={C.text3} />
          <Text style={styles.participantText}>{item.participantCount.toLocaleString()}명 참여 중</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function ExploreScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useChallenges(keyword || undefined);
  const items = data?.pages.flatMap((p) => p.data) ?? [];

  const handleSearch = useCallback(() => setKeyword(search.trim()), [search]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headline}>탐색</Text>
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={18} color={C.text3} style={styles.searchIcon} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholder="챌린지 검색"
            placeholderTextColor={C.text3}
            style={styles.searchInput}
          />
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChallengeItem item={item} />}
        contentContainerStyle={styles.list}
        onEndReached={() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage(); }}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={
          <Text style={styles.listTitle}>챌린지 목록</Text>
        }
        ListEmptyComponent={
          isLoading
            ? <ActivityIndicator color={C.blue} style={{ marginTop: 40 }} />
            : <Empty icon="search" title="챌린지가 없어요" sub="다른 키워드로 검색해보세요" />
        }
        ListFooterComponent={
          isFetchingNextPage ? <ActivityIndicator color={C.blue} style={{ marginVertical: 16 }} /> : null
        }
        showsVerticalScrollIndicator={false}
      />

      <Pressable onPress={() => router.push('/challenges/create')} style={styles.fab}>
        <Ionicons name="add" size={24} color="#fff" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
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
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  listTitle: { fontSize: 16, fontWeight: '700', color: C.black, marginBottom: 12, marginTop: 4 },
  listItem: { flexDirection: 'row', gap: 14, marginBottom: 16 },
  listAvatar: {
    width: 72, height: 72, borderRadius: 14, flexShrink: 0,
    alignItems: 'center', justifyContent: 'center',
  },
  listAvatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  listInfo: { flex: 1, paddingTop: 2, gap: 4 },
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
