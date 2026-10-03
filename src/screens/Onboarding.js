import React, { useState, useRef } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { C, shadowSm } from '../theme';
import { Button, Card } from '../components';
import { useStore } from '../store';

const SLIDES = [
  { icon: '📚', title: 'Pustak Bhandar', text: 'The student book marketplace — buy, sell and connect with peers on campus.', accent: C.accent },
  { icon: '💸', title: 'Save Every Semester', text: 'New textbooks drain your budget. Sell old ones, buy affordable used copies from verified students.', accent: '#27AE60' },
  { icon: '🤝', title: 'Trusted & Secure', text: 'Verified student profiles, in-app chat, and safe handover options — pickup or delivery.', accent: '#7C3AED' },
  { icon: '🚀', title: 'Join the Community', text: 'Affordable · Sustainable · Convenient\n\nBe part of Pro Practical\'s vision to support students.', accent: C.accent },
];

export default function Onboarding() {
  const { actions } = useStore();
  const [step, setStep] = useState(0);
  const [f, setF] = useState({ name: '', college: '', course: '', studentId: '', email: '' });
  const set = (k) => (v) => setF((p) => ({ ...p, [k]: v }));

  if (step < SLIDES.length) {
    const sl = SLIDES[step];
    const isLast = step === SLIDES.length - 1;
    return (
      <View style={[s.slide, { backgroundColor: C.primary }]}>
        {/* Progress dots */}
        <View style={s.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[s.dot, i === step && { backgroundColor: sl.accent, width: 20 }]} />
          ))}
        </View>

        <View style={s.slideContent}>
          <View style={[s.iconCircle, { backgroundColor: sl.accent + '22', borderColor: sl.accent + '44' }]}>
            <Text style={{ fontSize: 56 }}>{sl.icon}</Text>
          </View>
          <Text style={s.hero}>{sl.title}</Text>
          <Text style={s.heroText}>{sl.text}</Text>
        </View>

        <View style={s.slideBottom}>
          <Button
            kind="accent"
            title={isLast ? 'Get Started →' : 'Next →'}
            onPress={() => setStep(step + 1)}
            style={{ borderRadius: 16 }}
          />
          {step > 0 && (
            <Button
              kind="ghost"
              title="← Back"
              onPress={() => setStep(step - 1)}
              style={{ marginTop: 8 }}
            />
          )}
          <Text style={s.footer}>By Pro Practical · All data stays on your device</Text>
        </View>
      </View>
    );
  }

  const submit = () => {
    if (!f.name.trim() || !f.college.trim() || !f.course.trim() || !f.studentId.trim() || !f.email.trim()) {
      return Alert.alert('Missing details', 'Please fill in all fields.');
    }
    actions.register(f);
  };

  const FIELDS = [
    { k: 'name',      label: 'Full name',           icon: '👤', caps: 'words' },
    { k: 'college',   label: 'College / Institution', icon: '🏫', caps: 'words' },
    { k: 'course',    label: 'Course (e.g. B.Tech)',  icon: '📖', caps: 'words' },
    { k: 'studentId', label: 'Student ID',            icon: '🪪', caps: 'characters' },
    { k: 'email',     label: 'College email',         icon: '✉️', caps: 'none', kb: 'email-address' },
  ];

  return (
    <KeyboardAvoidingView style={s.full} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 60 }} keyboardShouldPersistTaps="handled">
        {/* Banner */}
        <View style={s.banner}>
          <Text style={s.bannerTitle}>📚 Pustak Bhandar</Text>
          <Text style={s.bannerSub}>Create your student profile to get started</Text>
        </View>

        <Text style={s.h1}>Almost there!</Text>
        <Text style={s.sub}>Use your college email and student ID to earn a Verified ✔ badge.</Text>

        <Card style={{ marginTop: 16, gap: 0 }}>
          {FIELDS.map(({ k, label, icon, caps, kb }) => (
            <View key={k} style={s.fieldWrap}>
              <Text style={s.fieldIcon}>{icon}</Text>
              <TextInput
                placeholder={label}
                value={f[k]}
                onChangeText={set(k)}
                autoCapitalize={caps}
                keyboardType={kb || 'default'}
                style={s.input}
                placeholderTextColor={C.muted}
              />
            </View>
          ))}
          <Button title="Join Pustak Bhandar" onPress={submit} style={{ marginTop: 8 }} />
        </Card>

        <Text style={[s.sub, { textAlign: 'center', marginTop: 16 }]}>
          🔒 Your data is stored only on this device.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  full: { flex: 1, backgroundColor: C.bg },
  slide: { flex: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 40 },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: 40 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#3A5A80' },
  slideContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginBottom: 28,
  },
  hero: { fontSize: 30, fontWeight: '800', color: '#fff', textAlign: 'center', letterSpacing: 0.3 },
  heroText: { fontSize: 16, color: '#B8CFEA', textAlign: 'center', marginTop: 14, lineHeight: 25 },
  slideBottom: { paddingTop: 20 },
  footer: { color: '#5A7A9A', textAlign: 'center', marginTop: 16, fontSize: 11 },
  banner: {
    backgroundColor: C.primary,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  bannerSub: { color: '#B8CFEA', marginTop: 6, fontSize: 13 },
  h1: { fontSize: 26, fontWeight: '800', color: C.text },
  sub: { color: C.muted, marginTop: 6, fontSize: 13, lineHeight: 19 },
  fieldWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#FAFBFD',
    paddingHorizontal: 12,
  },
  fieldIcon: { fontSize: 16, marginRight: 10 },
  input: { flex: 1, paddingVertical: 13, color: C.text, fontSize: 14 },
});
