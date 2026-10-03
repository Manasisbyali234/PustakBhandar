import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C, shadow, shadowSm } from './theme';

export const Button = ({ title, onPress, kind = 'primary', style, disabled }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.82}
    style={[
      s.btn,
      kind === 'outline' && s.btnOutline,
      kind === 'danger' && { backgroundColor: C.danger },
      kind === 'accent' && { backgroundColor: C.accent },
      kind === 'ghost' && { backgroundColor: 'transparent', paddingVertical: 10 },
      disabled && { opacity: 0.45 },
      style,
    ]}
  >
    <Text style={[s.btnText, kind === 'outline' && { color: C.primary }, kind === 'ghost' && { color: C.primary }]}>{title}</Text>
  </TouchableOpacity>
);

export const Chip = ({ label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.75} style={[s.chip, active && s.chipActive]}>
    <Text style={[s.chipText, active && { color: '#fff' }]}>{label}</Text>
  </TouchableOpacity>
);

export const Badge = ({ text, color = C.green }) => (
  <View style={[s.badge, { backgroundColor: color + '18', borderColor: color + '40', borderWidth: 1 }]}>
    <Text style={[s.badgeText, { color }]}>{text}</Text>
  </View>
);

export const Card = ({ children, style }) => <View style={[s.card, shadow, style]}>{children}</View>;

export const Stars = ({ value, onChange }) => (
  <View style={{ flexDirection: 'row', gap: 2 }}>
    {[1, 2, 3, 4, 5].map((n) => (
      <TouchableOpacity key={n} disabled={!onChange} onPress={() => onChange && onChange(n)}>
        <Text style={{ fontSize: 22, color: n <= value ? C.accent : C.border }}>★</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export const RatingTag = ({ rating }) =>
  rating.count ? (
    <View style={s.ratingTag}>
      <Text style={s.ratingStar}>★</Text>
      <Text style={s.ratingVal}>{rating.avg.toFixed(1)}</Text>
      <Text style={s.ratingCount}>({rating.count})</Text>
    </View>
  ) : (
    <View style={[s.ratingTag, { backgroundColor: C.bg }]}>
      <Text style={{ color: C.muted, fontSize: 11 }}>New seller</Text>
    </View>
  );

export const SectionLabel = ({ children, style }) => (
  <Text style={[s.sectionLabel, style]}>{children}</Text>
);

export const Divider = () => <View style={s.divider} />;

export const money = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const s = StyleSheet.create({
  btn: {
    backgroundColor: C.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    ...shadowSm,
  },
  btnOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: C.primary,
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15, letterSpacing: 0.3 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 22,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: C.border,
    marginRight: 8,
    ...shadowSm,
  },
  chipActive: { backgroundColor: C.primary, borderColor: C.primary },
  chipText: { color: C.text, fontSize: 13, fontWeight: '600' },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.2 },
  card: { backgroundColor: C.card, borderRadius: 18, padding: 16 },
  ratingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBF0',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 2,
  },
  ratingStar: { color: C.accent, fontSize: 12 },
  ratingVal: { color: C.text, fontWeight: '700', fontSize: 12 },
  ratingCount: { color: C.muted, fontSize: 11 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: C.muted,
    marginTop: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 10 },
});
