import { Image } from 'expo-image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, SeverityBadge, Tap } from '@/components/ui';
import {
  CATEGORY_ICON,
  CATEGORY_NAMES,
  CategoryId,
  STATUS_LABEL,
} from '@/constants/categories';
import { Palette, Radius, Shadow, Space, Type } from '@/constants/design';
import { NARIMANOV, Report, useReports } from '@/lib/store';

type Filter = 'all' | CategoryId;

const REGION: Region = {
  latitude: NARIMANOV.lat,
  longitude: NARIMANOV.lng,
  latitudeDelta: 0.04,
  longitudeDelta: 0.035,
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { allReports } = useReports();
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<Report | null>(null);
  const [tracks, setTracks] = useState(true);
  const mapRef = useRef<MapView>(null);

  // render custom marker views once, then stop tracking for performance
  useEffect(() => {
    const t = setTimeout(() => setTracks(false), 1600);
    return () => clearTimeout(t);
  }, []);

  const shown = useMemo(
    () => (filter === 'all' ? allReports : allReports.filter((r) => r.categoryId === filter)),
    [allReports, filter]
  );

  // categories that actually have reports, for the filter row
  const presentCats = useMemo(() => {
    const set = new Set<CategoryId>(allReports.map((r) => r.categoryId));
    return (Object.keys(CATEGORY_NAMES) as CategoryId[]).filter((c) => set.has(c));
  }, [allReports]);

  const focus = (r: Report) => {
    setSelected(r);
    mapRef.current?.animateToRegion(
      { latitude: r.lat, longitude: r.lng, latitudeDelta: 0.008, longitudeDelta: 0.008 },
      450
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: Palette.bgDeep }}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_DEFAULT}
        style={{ flex: 1 }}
        initialRegion={REGION}
        showsUserLocation
        showsMyLocationButton={false}
        onPress={() => setSelected(null)}>
        {shown.map((r) => {
          const cat = CATEGORY_ICON[r.categoryId];
          const active = selected?.id === r.id;
          return (
            <Marker
              key={r.id}
              coordinate={{ latitude: r.lat, longitude: r.lng }}
              onPress={() => focus(r)}
              tracksViewChanges={tracks || active}>
              <View style={{ alignItems: 'center' }}>
                <View
                  style={{
                    width: active ? 44 : 38,
                    height: active ? 44 : 38,
                    borderRadius: 22,
                    backgroundColor: cat.color,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 2.5,
                    borderColor: '#fff',
                    ...Shadow.raised,
                  }}>
                  <Icon name={cat.icon} set={cat.iconSet} size={active ? 22 : 19} color="#fff" />
                </View>
                <View
                  style={{
                    width: 0,
                    height: 0,
                    borderLeftWidth: 5,
                    borderRightWidth: 5,
                    borderTopWidth: 8,
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    borderTopColor: '#fff',
                    marginTop: -1,
                  }}
                />
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* floating header + filters */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingTop: insets.top + 8 }}>
        <View style={{ paddingHorizontal: Space.lg }}>
          <View
            style={{
              backgroundColor: Palette.surface,
              borderRadius: Radius.lg,
              borderCurve: 'continuous',
              paddingHorizontal: Space.lg,
              paddingVertical: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              ...Shadow.card,
            }}>
            <Icon name="map-marker-radius" size={22} color={Palette.primary} />
            <View style={{ flex: 1 }}>
              <Text style={{ ...Type.h3, color: Palette.text }}>Canlı Xəritə</Text>
              <Text style={{ ...Type.small, color: Palette.textMuted }}>
                {shown.length} aktiv müraciət · Nərimanov
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: Space.lg, paddingVertical: Space.md }}>
          <FilterChip
            label="Hamısı"
            color={Palette.primary}
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          {presentCats.map((c) => (
            <FilterChip
              key={c}
              label={CATEGORY_NAMES[c]}
              icon={CATEGORY_ICON[c].icon}
              iconSet={CATEGORY_ICON[c].iconSet}
              color={CATEGORY_ICON[c].color}
              active={filter === c}
              onPress={() => setFilter(filter === c ? 'all' : c)}
            />
          ))}
        </ScrollView>
      </View>

      {/* selected detail card */}
      {selected && (
        <Animated.View
          entering={FadeInUp.duration(300)}
          style={{
            position: 'absolute',
            left: Space.lg,
            right: Space.lg,
            bottom: insets.bottom + 96,
          }}>
          <PinDetail report={selected} onClose={() => setSelected(null)} />
        </Animated.View>
      )}
    </View>
  );
}

function FilterChip({
  label,
  icon,
  iconSet,
  color,
  active,
  onPress,
}: {
  label: string;
  icon?: string;
  iconSet?: 'mci' | 'ion';
  color: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Tap onPress={onPress} haptic>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 14,
          paddingVertical: 9,
          borderRadius: Radius.pill,
          backgroundColor: active ? color : Palette.surface,
          ...Shadow.soft,
        }}>
        {icon && <Icon name={icon} set={iconSet} size={15} color={active ? '#fff' : color} />}
        {!icon && (
          <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: active ? '#fff' : color }} />
        )}
        <Text style={{ ...Type.small, color: active ? '#fff' : Palette.text }}>{label}</Text>
      </View>
    </Tap>
  );
}

function PinDetail({ report, onClose }: { report: Report; onClose: () => void }) {
  const cat = CATEGORY_ICON[report.categoryId];
  return (
    <View
      style={{
        backgroundColor: Palette.surface,
        borderRadius: Radius.lg,
        borderCurve: 'continuous',
        padding: Space.lg,
        flexDirection: 'row',
        gap: 14,
        ...Shadow.raised,
      }}>
      {report.photoUri ? (
        <Image source={{ uri: report.photoUri }} style={{ width: 64, height: 64, borderRadius: 14 }} contentFit="cover" />
      ) : (
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 14,
            backgroundColor: cat.color + '1A',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={cat.icon} set={cat.iconSet} size={30} color={cat.color} />
        </View>
      )}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <Text style={{ ...Type.h3, color: Palette.text, flex: 1 }} numberOfLines={1}>
            {report.title}
          </Text>
          <SeverityBadge severity={report.severity} small />
        </View>
        <Text style={{ ...Type.small, color: Palette.textMuted, marginTop: 3 }} numberOfLines={1}>
          {report.address}
        </Text>
        <Text style={{ ...Type.small, color: Palette.primary, marginTop: 4 }} numberOfLines={1}>
          {STATUS_LABEL[report.status]} · {report.department}
        </Text>
      </View>
      <Tap onPress={onClose} haptic={false} style={{ alignSelf: 'flex-start' }}>
        <Icon name="close" set="ion" size={20} color={Palette.textFaint} />
      </Tap>
    </View>
  );
}
