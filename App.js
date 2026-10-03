import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Modal } from 'react-native';
import { StoreProvider, useStore } from './src/store';
import { C, shadow } from './src/theme';
import Onboarding from './src/screens/Onboarding';
import Home from './src/screens/Home';
import Sell from './src/screens/Sell';
import Chats from './src/screens/Chats';
import Profile from './src/screens/Profile';
import Detail from './src/screens/Detail';
import Chat from './src/screens/Chat';

const TABS = [
  { key: 'home',    label: 'Browse',  icon: '🏠' },
  { key: 'sell',    label: 'Sell',    icon: '➕' },
  { key: 'chats',   label: 'Chats',   icon: '💬' },
  { key: 'profile', label: 'Profile', icon: '👤' },
];

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={{ padding: 24, paddingTop: 70 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: C.danger }}>Something went wrong</Text>
          <Text style={{ marginTop: 12, color: C.text }}>{String(this.state.error?.message || this.state.error)}</Text>
          <Text style={{ marginTop: 12, color: C.muted, fontSize: 12 }}>{String(this.state.error?.stack || '').slice(0, 1200)}</Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

function Root() {
  const { ready, user } = useStore();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('home');
  const [detailId, setDetailId] = useState(null);
  const [chatId, setChatId] = useState(null);

  if (!ready) {
    return <View style={s.center}><ActivityIndicator size="large" color={C.primary} /></View>;
  }
  if (!user) return <Onboarding />;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 10 }]}>
        <View style={s.headerInner}>
          <View>
            <Text style={s.logoSub}>STUDENT MARKETPLACE</Text>
            <Text style={s.logo}>📚 Pustak Bhandar</Text>
          </View>
          <View style={s.headerBadge}>
            <Text style={s.headerBadgeText}>BETA</Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        {tab === 'home'    && <Home onOpen={setDetailId} />}
        {tab === 'sell'    && <Sell goHome={() => setTab('home')} />}
        {tab === 'chats'   && <Chats onOpen={setChatId} />}
        {tab === 'profile' && <Profile onOpen={setDetailId} />}
      </View>

      {/* Tab Bar */}
      <View style={[s.tabs, { paddingBottom: Math.max(insets.bottom, 10) }]}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <TouchableOpacity key={t.key} style={s.tab} onPress={() => setTab(t.key)} activeOpacity={0.7}>
              <View style={[s.tabIconWrap, active && s.tabIconActive]}>
                <Text style={{ fontSize: 18 }}>{t.icon}</Text>
              </View>
              <Text style={[s.tabLbl, active && s.tabLblActive]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Modal visible={!!detailId} animationType="slide" onRequestClose={() => setDetailId(null)}>
        {detailId && (
          <Detail bookId={detailId} onClose={() => setDetailId(null)}
            onChat={(id) => { setDetailId(null); setTimeout(() => setChatId(id), 350); }} />
        )}
      </Modal>
      <Modal visible={!!chatId} animationType="slide" onRequestClose={() => setChatId(null)}>
        {chatId && <Chat bookId={chatId} onClose={() => setChatId(null)} />}
      </Modal>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <ErrorBoundary>
        <StoreProvider>
          <Root />
        </StoreProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg },
  header: {
    backgroundColor: C.primary,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerInner: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' },
  logoSub: { color: '#7FA8D4', fontSize: 10, fontWeight: '700', letterSpacing: 1.5 },
  logo: { color: '#fff', fontSize: 22, fontWeight: '800', marginTop: 2 },
  headerBadge: {
    backgroundColor: C.accent,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 2,
  },
  headerBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: C.border,
    paddingTop: 8,
    ...shadow,
    shadowOffset: { width: 0, height: -2 },
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 2 },
  tabIconWrap: {
    width: 40,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconActive: { backgroundColor: C.primary + '15' },
  tabLbl: { fontSize: 11, color: C.muted, marginTop: 2, fontWeight: '500' },
  tabLblActive: { color: C.primary, fontWeight: '800' },
});
