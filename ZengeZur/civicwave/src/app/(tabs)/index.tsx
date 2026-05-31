import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ScrollView, Text, TextInput, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Tap } from '@/components/ui';
import {
  ALL_SERVICES,
  SERVICE_SECTIONS,
  Service,
} from '@/constants/categories';
import { Gradients, Palette, Radius, Shadow, Space, Type } from '@/constants/design';
import { USER } from '@/constants/user';
import { useReports } from '@/lib/store';

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { totalPoints } = useReports();
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('az');
    if (!q) return null;
    return ALL_SERVICES.filter(
      (s) =>
        s.title.toLocaleLowerCase('az').includes(q) ||
        s.subtitle.toLocaleLowerCase('az').includes(q)
    );
  }, [query]);

  const openService = (s: Service) =>
    router.push({ pathname: '/report/new', params: { category: s.categoryId, service: s.id } });

  return (
    <View style={{ flex: 1, backgroundColor: Palette.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + Space.md,
          paddingBottom: 130,
          paddingHorizontal: Space.lg,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ ...Type.small, color: Palette.textMuted }}>Salam, {USER.name} 👋</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 }}>
              <Icon name="map-marker" size={18} color={Palette.primary} />
              <Text style={{ ...Type.h2, color: Palette.text }}>Nərimanov Rayonu</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: Palette.surface,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: Radius.pill,
              ...Shadow.soft,
            }}>
            <Icon name="star-four-points" size={15} color={Palette.medium} />
            <Text style={{ ...Type.bodyStrong, color: Palette.text }}>{totalPoints}</Text>
          </View>
        </Animated.View>

        {/* AI Smart Select hero */}
        <Animated.View entering={FadeInDown.delay(80).duration(550)} style={{ marginTop: Space.xl }}>
          <Tap onPress={() => router.push({ pathname: '/report/new', params: { mode: 'ai' } })}>
            <LinearGradient
              colors={Gradients.ai}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: Radius.xl,
                borderCurve: 'continuous',
                padding: Space.xl,
                overflow: 'hidden',
                ...Shadow.raised,
              }}>
              <View
                style={{
                  position: 'absolute',
                  right: -30,
                  top: -30,
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  backgroundColor: 'rgba(255,255,255,0.12)',
                }}
              />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 18,
                    borderCurve: 'continuous',
                    backgroundColor: 'rgba(255,255,255,0.22)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon name="add" set="ion" size={28} color="#fff" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...Type.h2, color: '#fff' }}>AI ilə Ağıllı Seçim</Text>
                  <Text style={{ ...Type.small, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>
                    Yeni müraciət yarat
                  </Text>
                </View>
                <Icon name="arrow-forward" set="ion" size={22} color="#fff" />
              </View>
            </LinearGradient>
          </Tap>
        </Animated.View>

        {/* Search */}
        <Animated.View
          entering={FadeInDown.delay(150).duration(550)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            backgroundColor: Palette.surface,
            borderRadius: Radius.md,
            borderCurve: 'continuous',
            paddingHorizontal: 14,
            height: 52,
            marginTop: Space.lg,
            ...Shadow.soft,
          }}>
          <Icon name="search" set="ion" size={19} color={Palette.textFaint} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Müraciət növünü axtarın"
            placeholderTextColor={Palette.textFaint}
            style={{ flex: 1, ...Type.body, color: Palette.text }}
          />
          {query.length > 0 && (
            <Tap onPress={() => setQuery('')} haptic={false}>
              <Icon name="close-circle" set="ion" size={19} color={Palette.textFaint} />
            </Tap>
          )}
        </Animated.View>

        {/* Results / sections */}
        {filtered ? (
          <Animated.View entering={FadeIn.duration(300)} style={{ marginTop: Space.lg }}>
            <Text style={{ ...Type.small, color: Palette.textMuted, marginBottom: Space.md }}>
              {filtered.length} nəticə tapıldı
            </Text>
            <View style={cardGroup}>
              {filtered.map((s, i) => (
                <ServiceRow
                  key={s.id}
                  service={s}
                  onPress={() => openService(s)}
                  last={i === filtered.length - 1}
                />
              ))}
              {filtered.length === 0 && (
                <Text style={{ ...Type.body, color: Palette.textMuted, padding: Space.lg }}>
                  Nəticə tapılmadı. AI ilə Ağıllı Seçimdən istifadə edin.
                </Text>
              )}
            </View>
          </Animated.View>
        ) : (
          SERVICE_SECTIONS.map((section, si) => (
            <Animated.View
              key={section.title}
              entering={FadeInDown.delay(200 + si * 70).duration(550)}>
              <Text
                style={{
                  ...Type.h3,
                  color: Palette.text,
                  marginTop: Space.xxl,
                  marginBottom: Space.md,
                  marginLeft: Space.xs,
                }}>
                {section.title}
              </Text>
              <View style={cardGroup}>
                {section.data.map((s, i) => (
                  <ServiceRow
                    key={s.id}
                    service={s}
                    onPress={() => openService(s)}
                    last={i === section.data.length - 1}
                  />
                ))}
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function ServiceRow({
  service,
  onPress,
  last,
}: {
  service: Service;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Tap onPress={onPress} scaleTo={0.985} haptic>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
          paddingVertical: 14,
          paddingHorizontal: Space.lg,
          borderBottomWidth: last ? 0 : 1,
          borderBottomColor: Palette.border,
        }}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            borderCurve: 'continuous',
            backgroundColor: service.color + '1A',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={service.icon} set={service.iconSet} size={23} color={service.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...Type.h3, color: Palette.text }}>{service.title}</Text>
          <Text style={{ ...Type.small, color: Palette.textMuted, marginTop: 1 }}>
            {service.subtitle}
          </Text>
        </View>
        <Icon name="chevron-forward" set="ion" size={20} color={Palette.textFaint} />
      </View>
    </Tap>
  );
}

const cardGroup = {
  backgroundColor: Palette.surface,
  borderRadius: Radius.lg,
  borderCurve: 'continuous' as const,
  overflow: 'hidden' as const,
  ...Shadow.card,
};
