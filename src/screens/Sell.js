import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Switch, Alert, StyleSheet } from 'react-native';
import { C } from '../theme';
import { Button, Chip, Card, Divider, money } from '../components';
import { useStore } from '../store';
import { FEATURED_FEE } from '../storage';

const CONDITIONS = ['Like New', 'Good', 'Fair'];
const empty = { title: '', author: '', course: '', mrp: '', price: '', condition: 'Good', description: '' };

export default function Sell({ goHome }) {
  const { user, actions, commissionRate } = useStore();
  const [f, setF] = useState({ ...empty, course: user.course });
  const [college, setCollege] = useState(user.college);
  const [delivery, setDelivery] = useState(['Pickup']);
  const [featured, setFeatured] = useState(false);
  const [pickupLocation, setPickupLocation] = useState('');
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  const price = Number(f.price) || 0;
  const fee   = Math.round(price * commissionRate);

  const toggleDelivery = (d) =>
    setDelivery((p) => (p.includes(d) ? (p.length > 1 ? p.filter((x) => x !== d) : p) : [...p, d]));

  const submit = () => {
    if (!f.title.trim() || !f.author.trim() || !f.course.trim() || !college.trim())
      return Alert.alert('Missing details', 'Fill title, author, course and college.');
    if (!(price > 0)) return Alert.alert('Invalid price', 'Enter a selling price above 0.');
    const mrp = Number(f.mrp) || price;
    if (price > mrp) return Alert.alert('Check price', 'Selling price cannot be above the original price.');
    actions.addBook({
      title: f.title.trim(), author: f.author.trim(), course: f.course.trim(), college: college.trim(),
      price, mrp, condition: f.condition, description: f.description.trim(), delivery, featured,
      pickupLocation: delivery.includes('Pickup') ? pickupLocation.trim() : '',
    });
    setF({ ...empty, course: user.course });
    setFeatured(false);
    setPickupLocation('');
    Alert.alert('Listed! 🎉', 'Your book is now live in the marketplace.', [{ text: 'OK', onPress: goHome }]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 50 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={s.h1}>Sell a Book</Text>
      <Text style={s.sub}>List your used textbook and earn money</Text>

      {/* Book info */}
      <Text style={s.sectionLabel}>Book Information</Text>
      <Card>
        <Field label="Book title" icon="📖" value={f.title} onChange={set('title')} />
        <Field label="Author" icon="✍️" value={f.author} onChange={set('author')} />
        <Field label="Course (e.g. B.Tech)" icon="🎓" value={f.course} onChange={set('course')} />
        <Field label="College / Institution" icon="🏫" value={college} onChange={setCollege} />
      </Card>

      {/* Pricing */}
      <Text style={s.sectionLabel}>Pricing</Text>
      <Card>
        <Field label="Original price (₹)" icon="🏷️" value={f.mrp} onChange={set('mrp')} kb="numeric" />
        <Field label="Your selling price (₹)" icon="💰" value={f.price} onChange={set('price')} kb="numeric" last />
      </Card>

      {/* Condition */}
      <Text style={s.sectionLabel}>Condition</Text>
      <Card>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {CONDITIONS.map((c) => (
            <Chip key={c} label={c} active={f.condition === c} onPress={() => set('condition')(c)} />
          ))}
        </View>
      </Card>

      {/* Handover */}
      <Text style={s.sectionLabel}>Handover Options</Text>
      <Card>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          {['Pickup', 'Delivery'].map((d) => (
            <Chip key={d} label={d} active={delivery.includes(d)} onPress={() => toggleDelivery(d)} />
          ))}
        </View>
        {delivery.includes('Pickup') && (
          <Field label="Pickup location (optional)" icon="📍" value={pickupLocation} onChange={setPickupLocation} last />
        )}
      </Card>

      {/* Description */}
      <Text style={s.sectionLabel}>Description (optional)</Text>
      <Card>
        <TextInput
          value={f.description}
          onChangeText={set('description')}
          placeholder="Any notes about the book condition, edition, etc."
          placeholderTextColor={C.muted}
          multiline
          style={[s.input, { height: 80, textAlignVertical: 'top' }]}
        />
      </Card>

      {/* Featured */}
      <Text style={s.sectionLabel}>Boost Listing</Text>
      <Card>
        <View style={s.switchRow}>
          <View style={s.featuredIcon}>
            <Text style={{ fontSize: 22 }}>⭐</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.switchTitle}>Feature this listing</Text>
            <Text style={s.switchSub}>Shown at the top of search · {money(FEATURED_FEE)} fee</Text>
          </View>
          <Switch value={featured} onValueChange={setFeatured} trackColor={{ true: C.accent }} thumbColor="#fff" />
        </View>
      </Card>

      {/* Earnings preview */}
      <Text style={s.sectionLabel}>Earnings Preview</Text>
      <Card style={{ backgroundColor: C.greenLight }}>
        <EarningsRow label="Selling price" value={money(price)} />
        <EarningsRow label={`Commission (${(commissionRate * 100).toFixed(0)}%${user.premium ? ' Premium' : ''})`} value={`-${money(fee)}`} />
        {featured && <EarningsRow label="Featured fee" value={`-${money(FEATURED_FEE)}`} />}
        <Divider />
        <View style={s.earningsTotal}>
          <Text style={s.earningsTotalLabel}>You receive</Text>
          <Text style={s.earningsTotalVal}>{money(Math.max(0, price - fee - (featured ? FEATURED_FEE : 0)))}</Text>
        </View>
      </Card>

      <Button title="Publish Listing" onPress={submit} style={{ marginTop: 20 }} />
    </ScrollView>
  );
}

const Field = ({ label, icon, value, onChange, kb, last }) => (
  <View style={[s.fieldWrap, !last && { marginBottom: 10 }]}>
    <Text style={s.fieldIcon}>{icon}</Text>
    <View style={{ flex: 1 }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={kb || 'default'}
        style={s.input}
        placeholderTextColor={C.muted}
      />
    </View>
  </View>
);

const EarningsRow = ({ label, value }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
    <Text style={{ color: C.muted, fontSize: 13 }}>{label}</Text>
    <Text style={{ color: C.text, fontSize: 13, fontWeight: '600' }}>{value}</Text>
  </View>
);

const s = StyleSheet.create({
  h1: { fontSize: 26, fontWeight: '800', color: C.text },
  sub: { color: C.muted, fontSize: 13, marginTop: 3, marginBottom: 4 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: C.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 8,
  },
  fieldWrap: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  fieldIcon: { fontSize: 18, marginTop: 22 },
  fieldLabel: { fontSize: 11, fontWeight: '700', color: C.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    padding: 12,
    color: C.text,
    backgroundColor: '#FAFBFD',
    fontSize: 14,
  },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featuredIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: C.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  switchTitle: { fontWeight: '700', color: C.text, fontSize: 15 },
  switchSub: { color: C.muted, fontSize: 12, marginTop: 2 },
  earningsTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  earningsTotalLabel: { fontWeight: '800', color: C.text, fontSize: 15 },
  earningsTotalVal: { fontWeight: '800', color: C.green, fontSize: 20 },
});
