import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { C } from '../theme';
import { useStore } from '../store';

export default function Chat({ bookId, onClose }) {
  const { books, chats, actions } = useStore();
  const book = books.find((b) => b.id === bookId);
  const [text, setText] = useState('');
  const ref = useRef(null);
  const msgs = chats[bookId] || [];

  useEffect(() => {
    setTimeout(() => ref.current?.scrollToEnd({ animated: true }), 100);
  }, [msgs.length]);

  if (!book) return null;

  const send = () => {
    const t = text.trim();
    if (!t) return;
    actions.sendMessage(book, t);
    setText('');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={s.head}>
        <TouchableOpacity onPress={onClose} style={s.backBtn}>
          <Text style={s.backText}>‹</Text>
        </TouchableOpacity>
        <View style={s.headInfo}>
          <Text style={s.headName} numberOfLines={1}>{book.sellerName}</Text>
          <Text style={s.headBook} numberOfLines={1}>{book.title}</Text>
        </View>
        <View style={s.headAvatar}>
          <Text style={{ fontSize: 18 }}>👤</Text>
        </View>
      </View>

      {/* Safety notice */}
      <View style={s.safeBar}>
        <Text style={s.safeText}>🔒 Never share OTPs or bank details in chat</Text>
      </View>

      {/* Messages */}
      <FlatList
        ref={ref}
        data={msgs}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
        ListEmptyComponent={
          <View style={s.emptyChat}>
            <Text style={{ fontSize: 36 }}>👋</Text>
            <Text style={s.emptyChatText}>Say hi to negotiate the price or arrange pickup.</Text>
          </View>
        }
        renderItem={({ item: m }) => {
          const isMe = m.from === 'me';
          return (
            <View style={[s.bubbleWrap, isMe ? s.bubbleWrapMe : s.bubbleWrapThem]}>
              <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleThem]}>
                <Text style={[s.bubbleText, isMe && { color: '#fff' }]}>{m.text}</Text>
                <Text style={[s.time, isMe && { color: '#C9D6EA' }]}>
                  {new Date(m.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>
          );
        }}
      />

      {/* Input bar */}
      <View style={s.bar}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message…"
          style={s.input}
          placeholderTextColor={C.muted}
          onSubmitEditing={send}
          returnKeyType="send"
          multiline
        />
        <TouchableOpacity
          onPress={send}
          style={[s.sendBtn, !text.trim() && { opacity: 0.4 }]}
          disabled={!text.trim()}
        >
          <Text style={s.sendText}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  head: {
    backgroundColor: C.primary,
    paddingTop: 54,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: '#fff', fontSize: 22, fontWeight: '700', lineHeight: 26 },
  headInfo: { flex: 1 },
  headName: { color: '#fff', fontSize: 16, fontWeight: '800' },
  headBook: { color: '#B8CFEA', fontSize: 12, marginTop: 2 },
  headAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  safeBar: {
    backgroundColor: '#FFF8E7',
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#FFE4A0',
  },
  safeText: { color: '#8A6A00', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  emptyChat: { alignItems: 'center', marginTop: 40, gap: 10 },
  emptyChatText: { color: C.muted, fontSize: 14, textAlign: 'center' },
  bubbleWrap: { marginBottom: 6 },
  bubbleWrapMe: { alignItems: 'flex-end' },
  bubbleWrapThem: { alignItems: 'flex-start' },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: C.primary,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  bubbleText: { color: C.text, fontSize: 14, lineHeight: 20 },
  time: { fontSize: 10, color: C.muted, marginTop: 4, alignSelf: 'flex-end' },
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    paddingBottom: 28,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: C.border,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: C.text,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
