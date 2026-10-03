import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { C, shadowSm } from '../theme';
import { Chip, Badge, Card, RatingTag, SectionLabel, money } from '../components';
import { useStore } from '../store';
import { ADS } from '../storage';

const RANGES = [
  { k: 'any',  label: 'Any price',    test: () => true },
  { k: 'u250', label: 'Under ₹250',   test: (p) => p < 250 },
  { k: 'mid',  label: '₹250 – ₹500', test: (p) => p >= 250 && p <= 500 },
  { k: 'o500', label: 'Above ₹500',   test: (p) => p > 500 },
];

function AdBanner({ ads }) {
  const [idx, setIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
      ]).start();
      setIdx((i) => (i + 1) % ads.length);
    }, 4000);
    return () => clearInterval(t);
  }, []);

  const ad = ads[idx];

  return (
    <View style={[adS.wrap, { backgroundColor: ad.light, borderColor: ad.color + '30' }]}>
      <View style={adS.topRow}>
        <View style={[adS.tagPill, { backgroundColor: ad.color }]}>
          <Text style={adS.tagText}>{ad.tag}</Text>
        </View>
        <Text style={adS.adLabel}>AD</Text>
      </View>
      <Animated.View style={{ opacity: fadeAnim }}>
        <View style={adS.body}>
          <Text style={adS.emoji}>{ad.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[adS.brand, { color: ad.color }]}>{ad.brand}</Text>
            <Text style={adS.headline}>{ad.headline}</Text>
            <Text style={adS.subtext}>{ad.text}</Text>
          </View>
        </View>
      </Animated.View>
      <View style={adS.dots}>
        {ads.map((_, i) => (
          <View key={i} style={[adS.dot, i === idx && { backgroundColor: ad.color, width: 16 }]} />
        ))}
      </View>
    </View>
  );
}

export default function Home({ onOpen }) {
  const { books, user, sellerRating } = useStore();
  const [q, setQ] = useState('');
  const [college, setCollege] = useState('All');
  const [course, setCourse] = useState('All');
  const [range, setRange] = useState('any');
  const [sort, setSort] = useState('new');
  const [myFirst, setMyFirst] = useState(true);

  const avail = books.filter((b) => b.status === 'available');
  const colleges = ['All', ...new Set(avail.map((b) => b.college))];
  const courses  = ['All', ...new Set(avail.map((b) => b.course))];
  const myCollege = user.college.trim().toLowerCase();

  const list = useMemo(() => {
    const rg = RANGES.find((r) => r.k === range);
    let r = avail.filter((b) => {
      const t = (b.title + ' ' + b.author).toLowerCase();
      return (
        t.includes(q.toLowerCase()) &&
        (college === 'All' || b.college === college) &&
        (course  === 'All' || b.course  === course) &&
        rg.test(b.price)
      );
    });
    const mine = (b) => (myFirst && b.college.trim().toLowerCase() === myCollege ? 0 : 1);
    return [...r].sort((a, b) => {
      if (mine(a) !== mine(b)) return mine(a) - mine(b);
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (sort === 'low')  return a.price - b.price;
      if (sort === 'high') return b.price - a.price;
      return b.createdAt - a.createdAt;
    });
  }, [books, q, college, course, range, sort, myFirst]);

  const header = (
    <View>
      {/* Greeting */}
      <View style={s.greetRow}>
        <View>
          <Text style={s.greetSub}>Good day,</Text>
          <Text style={s.greetName}>{user.name.split(' ')[0]} 👋</Text>
        </View>
        <View style={s.countPill}>
          <Text style={s.countText}>{avail.length} books live</Text>
        </View>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search by title or author…"
          value={q}
          onChangeText={setQ}
          style={s.searchInput}
          placeholderTextColor={C.muted}
        />
        {q.length > 0 && (
          <TouchableOpacity onPress={() => setQ('')} style={s.clearBtn}>
            <Text style={{ color: C.muted, fontSize: 16 }}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Ad Banner */}
      <AdBanner ads={ADS} />

      {/* Filters */}
      <SectionLabel>College</SectionLabel>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {colleges.map((c) => <Chip key={c} label={c} active={college === c} onPress={() => setCollege(c)} />)}
      </ScrollView>

      <SectionLabel>Course</SectionLabel>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {courses.map((c) => <Chip key={c} label={c} active={course === c} onPress={() => setCourse(c)} />)}
      </ScrollView>

      <SectionLabel>Price range</SectionLabel>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {RANGES.map((r) => <Chip key={r.k} label={r.label} active={range === r.k} onPress={() => setRange(r.k)} />)}
      </ScrollView>

      <SectionLabel>Sort & filter</SectionLabel>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip label="🎓 My college first" active={myFirst} onPress={() => setMyFirst(!myFirst)} />
        <Chip label="Newest" active={sort === 'new'}  onPress={() => setSort('new')} />
        <Chip label="Price ↑" active={sort === 'low'}  onPress={() => setSort('low')} />
        <Chip label="Price ↓" active={sort === 'high'} onPress={() => setSort('high')} />
      </ScrollView>

      <View style={s.resultsRow}>
        <Text style={s.resultsText}>
          {list.length} book{list.length === 1 ? '' : 's'} available
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: C.bg }}
      contentContainerStyle={{ padding: 16, paddingBottom: 30 }}
      data={list}
      keyExtractor={(b) => b.id}
      ListHeaderComponent={header}
      ListEmptyComponent={
        <View style={s.empty}>
          <Text style={{ fontSize: 36 }}>📭</Text>
          <Text style={s.emptyText}>No books match your filters.</Text>
        </View>
      }
      renderItem={({ item: b }) => {
        const inMyCollege = b.college.trim().toLowerCase() === myCollege;
        const off = b.mrp > b.price ? Math.round(((b.mrp - b.price) / b.mrp) * 100) : 0;
        return (
          <TouchableOpacity activeOpacity={0.88} onPress={() => onOpen(b.id)}>
            <Card style={[s.bookCard, b.featured && s.featuredCard]}>
              {/* Cover */}
              <View style={s.cover}>
                <Text style={{ fontSize: 30 }}>📖</Text>
                {off > 0 && (
                  <View style={s.offBadge}>
                    <Text style={s.offText}>{off}%{'\n'}OFF</Text>
                  </View>
                )}
              </View>

              {/* Info */}
              <View style={{ flex: 1 }}>
                <View style={s.badgeRow}>
                  {b.featured && <Badge text="⭐ Featured" color={C.accent} />}
                  {inMyCollege && (
                    <View style={{ marginLeft: b.featured ? 5 : 0 }}>
                      <Badge text="🎓 Your college" color={C.primary} />
                    </View>
                  )}
                </View>
                <Text style={s.bookTitle} numberOfLines={2}>{b.title}</Text>
                <Text style={s.bookMeta}>{b.author}</Text>
                <Text style={s.bookMeta} numberOfLines={1}>{b.college}</Text>

                <View style={s.sellerRow}>
                  <Text style={s.sellerName}>
                    {b.sellerId === 'me' ? 'You' : b.sellerName}
                    {b.sellerVerified ? ' ✔' : ''}
                  </Text>
                  <RatingTag rating={sellerRating(b.sellerId, b.sellerName)} />
                </View>

                <View style={s.priceRow}>
                  <Text style={s.price}>{money(b.price)}</Text>
                  {b.mrp > b.price && <Text style={s.mrp}>{money(b.mrp)}</Text>}
                  <View style={[s.condPill, { marginLeft: 'auto' }]}>
                    <Text style={s.condText}>{b.condition}</Text>
                  </View>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const adS = StyleSheet.create({
  wrap: {
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    borderWidth: 1,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  tagPill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '800', letterSpacing: 0.8 },
  adLabel: { color: '#AAB4C8', fontSize: 10, fontWeight: '700' },
  body: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  emoji: { fontSize: 32, marginTop: 2 },
  brand: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
  headline: { fontSize: 15, fontWeight: '800', color: C.text, lineHeight: 20 },
  subtext: { fontSize: 12, color: C.muted, marginTop: 3, lineHeight: 17 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#CBD5E1' },
});

const s = StyleSheet.create({
  greetRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  greetSub: { fontSize: 12, color: C.muted, fontWeight: '500' },
  greetName: { fontSize: 24, fontWeight: '800', color: C.text, marginTop: 1 },
  countPill: { backgroundColor: C.primary + '15', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  countText: { color: C.primary, fontWeight: '700', fontSize: 12 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    height: 48,
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: C.text, fontSize: 14 },
  clearBtn: { padding: 4 },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 4,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  resultsText: { fontSize: 13, fontWeight: '700', color: C.muted },
  empty: { alignItems: 'center', marginTop: 40, gap: 10 },
  emptyText: { color: C.muted, fontSize: 14 },
  bookCard: { marginBottom: 12, flexDirection: 'row', gap: 12 },
  featuredCard: { borderWidth: 1.5, borderColor: C.accent },
  cover: {
    width: 68,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#E8EEF8',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  offBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: C.green,
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  offText: { color: '#fff', fontSize: 9, fontWeight: '800', textAlign: 'center', lineHeight: 12 },
  badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 },
  bookTitle: { fontSize: 15, fontWeight: '800', color: C.text, lineHeight: 20 },
  bookMeta: { color: C.muted, fontSize: 12, marginTop: 1 },
  sellerRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 5 },
  sellerName: { color: C.muted, fontSize: 12, fontWeight: '600' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  price: { fontSize: 17, fontWeight: '800', color: C.green },
  mrp: { color: C.muted, textDecorationLine: 'line-through', fontSize: 12 },
  condPill: { backgroundColor: C.primary + '12', borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
  condText: { color: C.primary, fontWeight: '700', fontSize: 11 },
});
