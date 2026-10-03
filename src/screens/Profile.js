import React from 'react';
import { View, Text, ScrollView, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { C, shadowSm } from '../theme';
import { Button, Badge, Card, Stars, Divider, money } from '../components';
import { useStore } from '../store';

export default function Profile({ onOpen }) {
  const { user, books, orders, stats, actions } = useStore();
  const mine = books.filter((b) => b.sellerId === 'me');

  return (
    <ScrollView style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 50 }}>

      {/* Profile card */}
      <Card style={s.profileCard}>
        <View style={s.avatarWrap}>
          <Text style={{ fontSize: 36 }}>👤</Text>
        </View>
        <Text style={s.name}>{user.name}</Text>
        <Text style={s.meta}>{user.course} · {user.college}</Text>
        <Text style={s.meta}>ID: {user.studentId}</Text>
        <View style={s.badgeRow}>
          <Badge text={user.verified ? '✔ Verified student' : 'Unverified'} color={user.verified ? C.green : C.muted} />
          {user.premium && <Badge text="💎 Premium" color={C.accent} />}
        </View>
      </Card>

      {/* Impact stats */}
      <Text style={s.h2}>Your Impact</Text>
      <Card>
        <View style={s.statsRow}>
          <StatBox label="Saved" value={money(stats.saved)} color={C.green} />
          <View style={s.statDivider} />
          <StatBox label="Earned" value={money(stats.earned)} color={C.green} />
          <View style={s.statDivider} />
          <StatBox label="Books reused" value={String(stats.reused)} color={C.primary} />
        </View>
        <View style={s.ecoBanner}>
          <Text style={{ fontSize: 20 }}>🌱</Text>
          <Text style={s.ecoText}>
            Every reused book means less paper waste. You've given {stats.reused} book{stats.reused === 1 ? '' : 's'} a second life.
          </Text>
        </View>
      </Card>

      {/* Premium */}
      <Text style={s.h2}>Premium Seller</Text>
      <Card>
        <View style={s.premiumRow}>
          <Text style={{ fontSize: 28 }}>💎</Text>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.premiumTitle}>Lower commission rate</Text>
            <Text style={s.premiumSub}>2% instead of 5% for frequent sellers</Text>
          </View>
        </View>
        <Button
          kind={user.premium ? 'outline' : 'accent'}
          title={user.premium ? 'Cancel Premium' : 'Upgrade to Premium'}
          style={{ marginTop: 12 }}
          onPress={actions.togglePremium}
        />
        <Text style={s.note}>Demo: no real payment is taken.</Text>
      </Card>

      {/* My listings */}
      <Text style={s.h2}>My Listings ({mine.length})</Text>
      {mine.length === 0
        ? <EmptyState icon="📦" text="You haven't listed any books yet." />
        : mine.map((b) => (
          <TouchableOpacity key={b.id} onPress={() => onOpen(b.id)} activeOpacity={0.85}>
            <Card style={s.listingCard}>
              <View style={s.listingCover}>
                <Text style={{ fontSize: 20 }}>📖</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.listingTitle} numberOfLines={1}>{b.title}</Text>
                <Text style={s.meta}>{b.author}</Text>
                <Text style={[s.meta, { color: C.green, fontWeight: '700', marginTop: 3 }]}>{money(b.price)}</Text>
              </View>
              <Badge text={b.status === 'sold' ? 'SOLD' : 'LIVE'} color={b.status === 'sold' ? C.muted : C.green} />
            </Card>
          </TouchableOpacity>
        ))
      }

      {/* My purchases */}
      <Text style={s.h2}>My Purchases ({orders.length})</Text>
      {orders.length === 0
        ? <EmptyState icon="🛒" text="No purchases yet." />
        : orders.map((o) => (
          <Card key={o.id} style={{ marginBottom: 10 }}>
            <Text style={s.listingTitle}>{o.title}</Text>
            <Text style={s.meta}>{money(o.price)} · {o.mode} · from {o.sellerName}</Text>
            {o.handover?.mode === 'Pickup' && (
              <Text style={s.meta}>📍 {o.handover.place}{o.handover.time ? ' · ' + o.handover.time : ''}</Text>
            )}
            {o.handover?.mode === 'Delivery' && (
              <Text style={s.meta}>🚚 {o.handover.address} · 📞 {o.handover.phone}</Text>
            )}
            <Text style={s.meta}>Ordered {new Date(o.at).toLocaleDateString()}</Text>
            <Divider />
            <Text style={s.note}>{o.rating ? 'Your rating' : 'Rate this seller'}</Text>
            <Stars value={o.rating} onChange={(n) => actions.rateOrder(o.id, n)} />
          </Card>
        ))
      }

      <Button
        kind="danger"
        title="Reset all local data"
        style={{ marginTop: 24 }}
        onPress={() =>
          Alert.alert('Reset app?', 'This deletes your profile, listings, chats and orders from this device.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Reset', style: 'destructive', onPress: actions.resetAll },
          ])
        }
      />
    </ScrollView>
  );
}

const StatBox = ({ label, value, color }) => (
  <View style={{ flex: 1, alignItems: 'center' }}>
    <Text style={{ fontSize: 20, fontWeight: '800', color }}>{value}</Text>
    <Text style={{ fontSize: 11, color: C.muted, marginTop: 3 }}>{label}</Text>
  </View>
);

const EmptyState = ({ icon, text }) => (
  <View style={{ alignItems: 'center', paddingVertical: 20, gap: 8 }}>
    <Text style={{ fontSize: 32 }}>{icon}</Text>
    <Text style={{ color: C.muted, fontSize: 13 }}>{text}</Text>
  </View>
);

const s = StyleSheet.create({
  profileCard: { alignItems: 'center', paddingVertical: 24 },
  avatarWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: C.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  name: { fontSize: 22, fontWeight: '800', color: C.text },
  meta: { color: C.muted, marginTop: 2, fontSize: 13 },
  badgeRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  h2: { fontSize: 16, fontWeight: '800', color: C.text, marginTop: 22, marginBottom: 10 },
  statsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  statDivider: { width: 1, height: 40, backgroundColor: C.border },
  ecoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: C.greenLight,
    borderRadius: 12,
    padding: 12,
    marginTop: 14,
  },
  ecoText: { flex: 1, color: C.green, fontSize: 13, fontWeight: '600', lineHeight: 18 },
  premiumRow: { flexDirection: 'row', alignItems: 'center' },
  premiumTitle: { fontWeight: '800', color: C.text, fontSize: 15 },
  premiumSub: { color: C.muted, fontSize: 12, marginTop: 2 },
  note: { color: C.muted, fontSize: 11, marginTop: 8 },
  listingCard: { marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 12 },
  listingCover: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#E8EEF8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listingTitle: { fontWeight: '700', color: C.text, fontSize: 14 },
});
