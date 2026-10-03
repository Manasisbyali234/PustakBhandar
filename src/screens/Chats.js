import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../theme';
import { Card } from '../components';
import { useStore } from '../store';

export default function Chats({ onOpen }) {
  const { chats, books } = useStore();
  const threads = Object.keys(chats)
    .map((id) => ({ book: books.find((b) => b.id === id), msgs: chats[id] }))
    .filter((t) => t.book && t.msgs.length)
    .sort((a, b) => b.msgs[b.msgs.length - 1].at - a.msgs[a.msgs.length - 1].at);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={s.topBar}>
        <Text style={s.h1}>Messages</Text>
        {threads.length > 0 && (
          <View style={s.countPill}>
            <Text style={s.countText}>{threads.length}</Text>
          </View>
        )}
      </View>

      <FlatList
        data={threads}
        keyExtractor={(t) => t.book.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={{ fontSize: 48 }}>💬</Text>
            <Text style={s.emptyTitle}>No chats yet</Text>
            <Text style={s.emptyText}>Open a book listing and tap "Chat with seller" to start a conversation.</Text>
          </View>
        }
        renderItem={({ item: t }) => {
          const last = t.msgs[t.msgs.length - 1];
          const time = new Date(last.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isMe = last.from === 'me';
          return (
            <TouchableOpacity onPress={() => onOpen(t.book.id)} activeOpacity={0.85}>
              <Card style={s.thread}>
                <View style={s.avatar}>
                  <Text style={{ fontSize: 20 }}>👤</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={s.threadTop}>
                    <Text style={s.sellerName} numberOfLines={1}>{t.book.sellerName}</Text>
                    <Text style={s.time}>{time}</Text>
                  </View>
                  <Text style={s.bookTitle} numberOfLines={1}>{t.book.title}</Text>
                  <Text style={s.lastMsg} numberOfLines={1}>
                    {isMe ? 'You: ' : ''}{last.text}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const s = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
    gap: 10,
  },
  h1: { fontSize: 24, fontWeight: '800', color: C.text },
  countPill: {
    backgroundColor: C.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  countText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  thread: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  threadTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sellerName: { fontWeight: '800', color: C.text, fontSize: 15, flex: 1 },
  time: { color: C.muted, fontSize: 11 },
  bookTitle: { color: C.primary, fontSize: 12, fontWeight: '600', marginTop: 2 },
  lastMsg: { color: C.muted, fontSize: 13, marginTop: 2 },
  empty: { alignItems: 'center', marginTop: 60, paddingHorizontal: 30, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: C.text },
  emptyText: { color: C.muted, fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
