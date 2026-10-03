import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { C, shadow, shadowSm } from '../theme';
import { Button, Chip, Badge, Card, RatingTag, Divider, money } from '../components';
import { useStore } from '../store';
import { COMMISSION } from '../storage';

export default function Detail({ bookId, onClose, onChat }) {
  const { books, actions, commissionRate, sellerRating } = useStore();
  const book = books.find((b) => b.id === bookId);
  const [mode, setMode] = useState(book?.delivery?.[0] || 'Pickup');
  const [place, setPlace] = useState(book?.pickupLocation || '');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  if (!book) return null;

  const mine = book.sellerId === 'me';
  const sold = book.status === 'sold';
  const off  = Math.round(((book.mrp - book.price) / book.mrp) * 100);

  const buy = () => {
    let handover;
    if (mode === 'Pickup') {
      if (!place.trim()) return Alert.alert('Pickup details', 'Enter a meeting point on campus.');
      handover = { mode, place: place.trim(), time: time.trim() };
    } else {
      if (address.trim().length < 8) return Alert.alert('Delivery details', 'Enter your full delivery address.');
      if (!/^\d{10}$/.test(phone.trim())) return Alert.alert('Delivery details', 'Enter a valid 10-digit phone number.');
      handover = { mode, address: address.trim(), phone: phone.trim() };
    }
    Alert.alert(
      'Confirm purchase',
      `${book.title}\n${money(book.price)} · ${mode}\nPlatform fee included: ${money(Math.round(book.price * COMMISSION))}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy',
          onPress: () => {
            actions.buyBook(book, handover);
            Alert.alert('Order placed 🎉', 'Chat with the seller to confirm the ' + mode.toLowerCase() + ' details.', [{ text: 'OK', onPress: onClose }]);
          },
        },
      ]
    );
  };

  const inp = (value, set, placeholder, extra = {}) => (
    <TextInput value={value} onChangeText={set} placeholder={placeholder} placeholderTextColor={C.muted} style={s.input} {...extra} />
  );

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header bar */}
      <View style={s.topBar}>
        <TouchableOpacity onPress={onClose} style={s.closeBtn}>
          <Text style={s.closeText}>✕</Text>
        </TouchableOpacity>
        <Text style={s.topTitle} numberOfLines={1}>{book.title}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 50 }} keyboardShouldPersistTaps="handled">
        {/* Cover */}
        <View style={s.cover}>
          <Text style={{ fontSize: 64 }}>📖</Text>
          {book.featured && (
            <View style={s.featuredRibbon}>
              <Text style={s.featuredRibbonText}>⭐ FEATURED</Text>
            </View>
          )}
        </View>

        {/* Title & price */}
        <Text style={s.title}>{book.title}</Text>
        <Text style={s.author}>by {book.author}</Text>

        <View style={s.priceRow}>
          <Text style={s.price}>{money(book.price)}</Text>
          {book.mrp > book.price && <Text style={s.mrp}>{money(book.mrp)}</Text>}
          {off > 0 && <Badge text={`${off}% OFF`} color={C.green} />}
        </View>

        {/* Details card */}
        <Card style={{ marginTop: 16 }}>
          <Text style={s.cardTitle}>Book Details</Text>
          <Divider />
          {[
            ['Course',    book.course],
            ['College',   book.college],
            ['Condition', book.condition],
            ['Handover',  book.delivery.join(' / ')],
            book.pickupLocation && ['Pickup at', book.pickupLocation],
            book.description && ['Notes', book.description],
          ].filter(Boolean).map(([k, v]) => (
            <View key={k} style={s.detailRow}>
              <Text style={s.detailKey}>{k}</Text>
              <Text style={s.detailVal}>{v}</Text>
            </View>
          ))}
        </Card>

        {/* Seller card */}
        <Card style={{ marginTop: 12 }}>
          <Text style={s.cardTitle}>Seller</Text>
          <Divider />
          <View style={s.sellerRow}>
            <View style={s.sellerAvatar}>
              <Text style={{ fontSize: 22 }}>👤</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.sellerName}>{mine ? 'You' : book.sellerName}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 5 }}>
                <Badge text={book.sellerVerified ? '✔ Verified' : 'Unverified'} color={book.sellerVerified ? C.green : C.muted} />
                <RatingTag rating={sellerRating(book.sellerId, book.sellerName)} />
              </View>
            </View>
          </View>
        </Card>

        {sold && (
          <View style={s.soldBanner}>
            <Text style={s.soldText}>🚫 This book has been sold</Text>
          </View>
        )}

        {!sold && !mine && (
          <>
            <Text style={[s.cardTitle, { marginTop: 20, marginBottom: 8 }]}>Choose Handover</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {book.delivery.map((d) => <Chip key={d} label={d} active={mode === d} onPress={() => setMode(d)} />)}
            </View>

            <Card style={{ marginTop: 12 }}>
              {mode === 'Pickup' ? (
                <>
                  <Text style={s.cardTitle}>Pickup Details</Text>
                  <Divider />
                  {inp(place, setPlace, 'Meeting point (e.g. library gate)')}
                  {inp(time, setTime, 'Preferred time (e.g. Mon 4 PM)')}
                </>
              ) : (
                <>
                  <Text style={s.cardTitle}>Delivery Details</Text>
                  <Divider />
                  {inp(address, setAddress, 'Full delivery address', { multiline: true, style: [s.input, { height: 70, textAlignVertical: 'top' }] })}
                  {inp(phone, setPhone, '10-digit phone number', { keyboardType: 'phone-pad', maxLength: 10 })}
                </>
              )}
            </Card>

            <Button title={`Buy now · ${money(book.price)}`} onPress={buy} style={{ marginTop: 16 }} />
            <Button kind="outline" title="💬 Chat with seller" onPress={() => onChat(book.id)} style={{ marginTop: 10 }} />
          </>
        )}

        {mine && (
          <>
            {!sold && (
              <Button title="Mark as sold" style={{ marginTop: 20 }} onPress={() => {
                const fee = Math.round(book.price * commissionRate);
                Alert.alert('Mark as sold?', `You earn ${money(book.price - fee)} after ${money(fee)} commission.`, [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Confirm', onPress: () => { actions.markSold(book.id); onClose(); } },
                ]);
              }} />
            )}
            <Button kind="danger" title="Delete listing" style={{ marginTop: 10 }} onPress={() =>
              Alert.alert('Delete listing?', 'This cannot be undone.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => { actions.deleteBook(book.id); onClose(); } },
              ])} />
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  topBar: {
    backgroundColor: C.primary,
    paddingTop: 54,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  topTitle: { flex: 1, color: '#fff', fontSize: 15, fontWeight: '700', textAlign: 'center', marginHorizontal: 8 },
  cover: {
    height: 160,
    borderRadius: 18,
    backgroundColor: '#E8EEF8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  featuredRibbon: {
    position: 'absolute',
    top: 12,
    right: 0,
    backgroundColor: C.accent,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  featuredRibbonText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  title: { fontSize: 24, fontWeight: '800', color: C.text, lineHeight: 30 },
  author: { color: C.muted, marginTop: 4, fontSize: 14 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 },
  price: { fontSize: 28, fontWeight: '800', color: C.green },
  mrp: { color: C.muted, textDecorationLine: 'line-through', fontSize: 15 },
  cardTitle: { fontSize: 13, fontWeight: '800', color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  detailRow: { flexDirection: 'row', paddingVertical: 6 },
  detailKey: { width: 88, color: C.muted, fontSize: 13, fontWeight: '600' },
  detailVal: { flex: 1, color: C.text, fontSize: 13 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 4 },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerName: { fontSize: 16, fontWeight: '700', color: C.text },
  soldBanner: {
    backgroundColor: C.dangerLight,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.danger + '30',
  },
  soldText: { color: C.danger, fontWeight: '700', fontSize: 15 },
  input: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    padding: 13,
    marginTop: 10,
    color: C.text,
    backgroundColor: '#FAFBFD',
    fontSize: 14,
  },
});
