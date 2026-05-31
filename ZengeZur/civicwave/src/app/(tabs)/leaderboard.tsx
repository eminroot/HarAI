import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Image, LayoutChangeEvent, ScrollView, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Bob, CountUp, PedestalBar } from '@/components/fx';
import { Icon, Tap } from '@/components/ui';
import { Gradients, Palette, Radius, Shadow, Space, Type } from '@/constants/design';

type Entry = { rank: number; name: string; points: number; me?: boolean; avatar?: any };

const AVATAR_COLORS = ['#3B5BDB', '#16A34A', '#F97316', '#8B5CF6', '#EC4899', '#0EA5E9', '#14B8A6', '#CA8A04'];

function initials(name: string) {
  const parts = name.split(' ');
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '');
}
function colorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}

const MEDAL = ['#F5C518', '#B8C2CC', '#CD7F32'];
const PEDESTAL_H = [92, 64, 48]; // by rank 1,2,3

export default function Leaderboard() {
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<'month' | 'year'>('month');

  // Tab screens stay mounted, so the `entering` animations only fire on the first
  // visit. Bump a key whenever the screen regains focus to remount the content and
  // replay every entrance animation. We skip the very first focus so the initial
  // mount animates on its own (no double-run).
  const [replayKey, setReplayKey] = useState(0);
  const firstFocus = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }
      setReplayKey((k) => k + 1);
    }, [])
  );

  const base: Entry[] = [
    { rank: 1, name: 'Eyyub Yaqubov', points: 4820, avatar: require('../../../images/EyyubYaqubov.png') },
    { rank: 2, name: 'Manaf Ağayev', points: 4310, avatar: require('../../../images/ManafAgayev.png') },
    { rank: 3, name: 'Eminem', points: 3990, avatar: require('../../../images/Eminem.png') },
    { rank: 4, name: 'Vüsal Hüseynov', points: 3640, avatar: require('../../../images/VusalHuseynov.png') },
    { rank: 5, name: 'The Rock', points: 3210, avatar: require('../../../images/Therock.png') },
    { rank: 6, name: 'Emin Baxışlı', points: 2980, me: true, avatar: require('../../../images/EminBaxishli.jpeg') },
    { rank: 7, name: 'Əvəz Əsgərov', points: 2610, avatar: require('../../../images/AvazAsgarov.jpeg') },
    { rank: 8, name: 'Qüdrət Abbaslı', points: 2350, avatar: require('../../../images/GudratAbbasli.jpeg') },
    { rank: 9, name: 'Qüdrət Qüdrətli', points: 2090, avatar: require('../../../images/GudratGudratli.jpeg') },
    { rank: 10, name: 'Oqtay Həşimli', points: 1870, avatar: require('../../../images/OqtayHasimli.jpeg') },
  ];
  const yearMul = period === 'year' ? 7 : 1;
  const entries = base
    .map((e) => ({ ...e, points: e.points * yearMul }))
    .sort((a, b) => b.points - a.points)
    .map((e, i) => ({ ...e, rank: i + 1 }));

  const podium = entries.slice(0, 3);
  const rest = entries.slice(3);
  const podiumOrder = [podium[1], podium[0], podium[2]].filter(Boolean); // 2 · 1 · 3

  return (
    <View style={{ flex: 1, backgroundColor: Palette.bg }}>
      <ScrollView
        key={replayKey}
        contentContainerStyle={{ paddingTop: insets.top + Space.md, paddingBottom: 130, paddingHorizontal: Space.lg }}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(450)}>
          <Text style={{ ...Type.title, color: Palette.text }}>Reytinq</Text>
          <Text style={{ ...Type.body, color: Palette.textMuted, marginTop: 2 }}>
            Nərimanov rayonunun ən fəal sakinləri
          </Text>
        </Animated.View>

        <PeriodToggle period={period} onChange={setPeriod} />

        {/* podium */}
        <Animated.View
          entering={FadeInDown.delay(80).duration(500)}
          style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 12, marginTop: Space.xxl }}>
          {podiumOrder.map((e) => {
            const isFirst = e.rank === 1;
            const popDelay = isFirst ? 520 : e.rank === 2 ? 260 : 360;
            return (
              <View key={e.name} style={{ alignItems: 'center', flex: 1 }}>
                <Animated.View entering={ZoomIn.delay(popDelay).springify().damping(9).mass(0.7)}>
                  <View style={{ position: 'relative' }}>
                    <View
                      style={{
                        width: isFirst ? 78 : 60,
                        height: isFirst ? 78 : 60,
                        borderRadius: isFirst ? 39 : 30,
                        backgroundColor: colorFor(e.name),
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 3,
                        borderColor: MEDAL[e.rank - 1],
                        overflow: 'hidden',
                        ...Shadow.card,
                      }}>
                      {e.avatar ? (
                        <Image source={e.avatar} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
                      ) : (
                        <Text style={{ color: '#fff', fontWeight: '800', fontSize: isFirst ? 28 : 22 }}>
                          {initials(e.name)}
                        </Text>
                      )}
                    </View>
                    {isFirst && (
                      <View style={{ position: 'absolute', top: -24, left: 0, right: 0, alignItems: 'center' }}>
                        <Bob>
                          <Icon name="crown" size={28} color={MEDAL[0]} />
                        </Bob>
                      </View>
                    )}
                    <View style={{ position: 'absolute', bottom: -6, left: 0, right: 0, alignItems: 'center' }}>
                      <View
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: MEDAL[e.rank - 1],
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 2,
                          borderColor: '#fff',
                        }}>
                        <Text style={{ color: '#fff', fontWeight: '800', fontSize: 11 }}>{e.rank}</Text>
                      </View>
                    </View>
                  </View>
                </Animated.View>

                <Text style={{ ...Type.small, color: Palette.text, marginTop: 14, textAlign: 'center' }} numberOfLines={1}>
                  {e.name.split(' ')[0]}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <CountUp
                    value={e.points}
                    delay={popDelay + 150}
                    style={{ ...Type.tiny, color: Palette.textMuted }}
                  />
                  <Text style={{ ...Type.tiny, color: Palette.textMuted }}> xal</Text>
                </View>

                <PedestalBar
                  target={PEDESTAL_H[e.rank - 1]}
                  delay={popDelay + 80}
                  gradient={isFirst ? Gradients.brand : (['#CBD5E1', '#E2E8F0'] as const)}
                />
              </View>
            );
          })}
        </Animated.View>

        {/* rest of list */}
        <View style={{ marginTop: Space.lg, gap: 10 }}>
          {rest.map((e, i) => (
            <Animated.View key={e.name} entering={FadeInDown.delay(650 + i * 70).duration(420)}>
              <ListRow e={e} />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function PeriodToggle({
  period,
  onChange,
}: {
  period: 'month' | 'year';
  onChange: (p: 'month' | 'year') => void;
}) {
  const [w, setW] = useState(0);
  const tx = useSharedValue(0);
  const inner = w > 0 ? (w - 8) / 2 : 0;

  useEffect(() => {
    tx.value = withTiming(period === 'month' ? 0 : inner, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
  }, [period, inner, tx]);

  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }] }));
  const onLayout = (ev: LayoutChangeEvent) => setW(ev.nativeEvent.layout.width);

  return (
    <View
      onLayout={onLayout}
      style={{ flexDirection: 'row', backgroundColor: Palette.surfaceAlt, borderRadius: Radius.pill, padding: 4, marginTop: Space.lg }}>
      {inner > 0 && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 4,
              left: 4,
              width: inner,
              bottom: 4,
              borderRadius: Radius.pill,
              backgroundColor: Palette.surface,
              ...Shadow.soft,
            },
            indicator,
          ]}
        />
      )}
      {(['month', 'year'] as const).map((p) => (
        <Tap key={p} onPress={() => onChange(p)} style={{ flex: 1 }} haptic>
          <View style={{ paddingVertical: 9, alignItems: 'center' }}>
            <Text style={{ ...Type.bodyStrong, color: period === p ? Palette.primary : Palette.textMuted }}>
              {p === 'month' ? 'Aylıq' : 'İllik'}
            </Text>
          </View>
        </Tap>
      ))}
    </View>
  );
}

function ListRow({ e }: { e: Entry }) {
  const glow = useSharedValue(0);
  useEffect(() => {
    if (e.me) glow.value = withRepeat(withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) }), -1, true);
  }, [e.me, glow]);
  const glowStyle = useAnimatedStyle(() => ({ opacity: e.me ? 0.4 + glow.value * 0.6 : 0 }));

  return (
    <View style={{ position: 'relative' }}>
      {e.me && (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              borderRadius: Radius.md + 2,
              borderWidth: 2,
              borderColor: Palette.primary,
            },
            glowStyle,
          ]}
        />
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          borderRadius: Radius.md,
          borderCurve: 'continuous',
          backgroundColor: e.me ? Palette.primarySoft : Palette.surface,
          ...Shadow.soft,
        }}>
        <Text style={{ ...Type.h3, color: Palette.textMuted, width: 26, textAlign: 'center' }}>{e.rank}</Text>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colorFor(e.name),
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          {e.avatar ? (
            <Image source={e.avatar} resizeMode="cover" style={{ width: '100%', height: '100%' }} />
          ) : (
            <Text style={{ color: '#fff', fontWeight: '700' }}>{initials(e.name)}</Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...Type.bodyStrong, color: Palette.text }}>
            {e.name}
            {e.me ? ' (Siz)' : ''}
          </Text>
          <Text style={{ ...Type.small, color: Palette.textMuted }}>Töhfəçi</Text>
        </View>
        <Text style={{ ...Type.bodyStrong, color: e.me ? Palette.primary : Palette.text }}>{e.points}</Text>
      </View>
    </View>
  );
}
