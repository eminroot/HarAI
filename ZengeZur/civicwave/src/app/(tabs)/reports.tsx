import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CountUp } from '@/components/fx';
import { Icon, PrimaryButton, SeverityBadge, Tap } from '@/components/ui';
import {
  CATEGORY_ICON,
  SEVERITY_POINTS,
  STATUS_LABEL,
  STATUS_ORDER,
  ReportStatus,
} from '@/constants/categories';
import { Gradients, Palette, Radius, Shadow, Space, Type } from '@/constants/design';
import { USER } from '@/constants/user';
import { Report, useReports } from '@/lib/store';

function timeAgo(ts: number) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return 'indicə';
  if (m < 60) return `${m} dəq əvvəl`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} saat əvvəl`;
  return `${Math.floor(h / 24)} gün əvvəl`;
}

const TIERS = [
  { name: 'Bürünc', min: 0, color: '#CD7F32' },
  { name: 'Gümüş', min: 250, color: '#8C97A8' },
  { name: 'Qızıl', min: 500, color: '#E0A100' },
  { name: 'Platin', min: 1000, color: '#6D5DF6' },
];

function tierInfo(points: number) {
  let idx = 0;
  for (let i = 0; i < TIERS.length; i++) if (points >= TIERS[i].min) idx = i;
  const current = TIERS[idx];
  const next = TIERS[idx + 1];
  const progress = next ? (points - current.min) / (next.min - current.min) : 1;
  const remaining = next ? next.min - points : 0;
  return { current, next, progress: Math.max(0, Math.min(1, progress)), remaining };
}

function initials(name: string) {
  const p = name.split(' ');
  return ((p[0]?.[0] ?? '') + (p[1]?.[0] ?? '')).toUpperCase();
}

export default function Reports() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { reports, totalPoints, rank } = useReports();

  return (
    <View style={{ flex: 1, backgroundColor: Palette.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + Space.md, paddingBottom: 130, paddingHorizontal: Space.lg }}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(450)}>
          <Text style={{ ...Type.title, color: Palette.text }}>Müraciətlərim</Text>
        </Animated.View>

        {/* Civic standing card */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)} style={{ marginTop: Space.lg }}>
          <StandingCard totalPoints={totalPoints} rank={rank} reportCount={reports.length} />
        </Animated.View>

        {/* New report button */}
        <View style={{ marginTop: Space.lg }}>
          <PrimaryButton
            label="Yeni müraciət göndər"
            icon="add"
            gradient={Gradients.ai}
            onPress={() => router.push({ pathname: '/report/new', params: { mode: 'ai' } })}
          />
        </View>

        {/* List */}
        {reports.length === 0 ? (
          <EmptyState />
        ) : (
          <View style={{ marginTop: Space.xl, gap: 14 }}>
            {reports.map((r, i) => (
              <Animated.View key={r.id} entering={FadeInDown.delay(i * 60).duration(450)}>
                <ReportCard report={r} />
              </Animated.View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function StandingCard({
  totalPoints,
  rank,
  reportCount,
}: {
  totalPoints: number;
  rank: number;
  reportCount: number;
}) {
  const { current, next, progress, remaining } = tierInfo(totalPoints);
  const fill = useSharedValue(0);
  useEffect(() => {
    fill.value = withDelay(400, withTiming(progress, { duration: 1000, easing: Easing.out(Easing.cubic) }));
  }, [progress, fill]);
  const fillStyle = useAnimatedStyle(() => ({ width: `${fill.value * 100}%` }));

  return (
    <View
      style={{
        backgroundColor: Palette.surface,
        borderRadius: Radius.xl,
        borderCurve: 'continuous',
        padding: Space.xl,
        borderWidth: 1,
        borderColor: Palette.border,
        ...Shadow.card,
      }}>
      {/* identity */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: Palette.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={{ color: '#fff', fontWeight: '800', fontSize: 18 }}>{initials(USER.fullName)}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ ...Type.h3, color: Palette.text }}>{USER.fullName}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 }}>
            <Icon name="medal" size={15} color={current.color} />
            <Text style={{ ...Type.small, color: Palette.textMuted }}>
              {current.name} mühafiz · rayonda #{rank}
            </Text>
          </View>
        </View>
      </View>

      {/* points + progress to next tier */}
      <View style={{ marginTop: Space.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 6 }}>
          <CountUp
            value={totalPoints}
            duration={1400}
            delay={250}
            style={{ fontSize: 36, lineHeight: 42, fontWeight: '800', letterSpacing: -0.5, color: Palette.text }}
          />
          <Text style={{ ...Type.body, color: Palette.textMuted }}>xal toplandı</Text>
        </View>

        <View
          style={{
            height: 9,
            borderRadius: 5,
            backgroundColor: Palette.surfaceAlt,
            overflow: 'hidden',
            marginTop: 12,
          }}>
          <Animated.View
            style={[{ height: '100%', borderRadius: 5, backgroundColor: current.color }, fillStyle]}
          />
        </View>
        <Text style={{ ...Type.small, color: Palette.textMuted, marginTop: 8 }}>
          {next ? `${next.name} mühafizə ${remaining} xal qalıb` : 'Ən yüksək səviyyə — Platin mühafiz 🏅'}
        </Text>
      </View>

      {/* stat strip */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: Space.lg,
          paddingTop: Space.lg,
          borderTopWidth: 1,
          borderTopColor: Palette.border,
        }}>
        <View style={{ flex: 1 }}>
          <StatItem icon="document-text-outline" value={`${reportCount}`} label="Müraciət" />
        </View>
        <View style={{ width: 1, height: 30, backgroundColor: Palette.border }} />
        <View style={{ flex: 1, paddingLeft: Space.lg }}>
          <StatItem icon="trending-up-outline" value="+85" label="Bu ay" />
        </View>
        <View style={{ width: 1, height: 30, backgroundColor: Palette.border }} />
        <View style={{ flex: 1, paddingLeft: Space.lg }}>
          <StatItem icon="people-outline" value="67" label="İştirakçı" />
        </View>
      </View>
    </View>
  );
}

function StatItem({ icon, value, label }: { icon: string; value: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
      <Icon name={icon} set="ion" size={19} color={Palette.textMuted} />
      <View>
        <Text style={{ ...Type.bodyStrong, color: Palette.text }}>{value}</Text>
        <Text style={{ ...Type.tiny, color: Palette.textMuted, fontSize: 10 }}>{label}</Text>
      </View>
    </View>
  );
}

function ReportCard({ report }: { report: Report }) {
  const cat = CATEGORY_ICON[report.categoryId];
  const rejected = report.status === 'rejected';
  return (
    <View
      style={{
        backgroundColor: Palette.surface,
        borderRadius: Radius.lg,
        borderCurve: 'continuous',
        padding: Space.lg,
        ...Shadow.card,
      }}>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {report.photoUri ? (
          <Image source={{ uri: report.photoUri }} style={{ width: 56, height: 56, borderRadius: 14 }} contentFit="cover" />
        ) : (
          <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: cat.color + '1A', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={cat.icon} set={cat.iconSet} size={28} color={cat.color} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <Text style={{ ...Type.h3, color: Palette.text, flex: 1 }} numberOfLines={1}>{report.title}</Text>
            <SeverityBadge severity={report.severity} small />
          </View>
          <Text style={{ ...Type.small, color: Palette.textMuted, marginTop: 3 }} numberOfLines={1}>
            {report.address} · {timeAgo(report.createdAt)}
          </Text>
          <Text style={{ ...Type.small, color: Palette.textMuted, marginTop: 1 }}>{report.department}</Text>
        </View>
      </View>

      {/* status: a rejected report leaves the normal lifecycle, so show a clear
          rejection banner instead of the progress timeline. */}
      {rejected ? <RejectedBanner /> : <AnimatedTimeline status={report.status} />}

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: Space.md }}>
        {rejected ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="close-circle" set="ion" size={14} color={Palette.critical} />
            <Text style={{ ...Type.small, color: Palette.critical }}>rədd edildi · xal verilmədi</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Icon name="star-four-points" size={14} color={report.status === 'pending' ? Palette.textFaint : Palette.medium} />
            <Text style={{ ...Type.small, color: report.status === 'pending' ? Palette.textFaint : Palette.text }}>
              {report.status === 'pending'
                ? `təsdiqdə +${SEVERITY_POINTS[report.severity]} xal`
                : `+${SEVERITY_POINTS[report.severity]} xal`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function RejectedBanner() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 9,
        backgroundColor: Palette.criticalSoft,
        paddingVertical: 11,
        paddingHorizontal: 14,
        borderRadius: Radius.md,
        borderCurve: 'continuous',
        marginTop: Space.lg,
      }}>
      <Icon name="close-circle" set="ion" size={18} color={Palette.critical} />
      <View style={{ flex: 1 }}>
        <Text style={{ ...Type.bodyStrong, color: Palette.critical }}>Müraciət rədd edildi</Text>
        <Text style={{ ...Type.small, color: Palette.critical, opacity: 0.85 }}>
          İdarə tərəfindən təsdiqlənmədi
        </Text>
      </View>
    </View>
  );
}

function AnimatedTimeline({ status }: { status: ReportStatus }) {
  const currentIndex = STATUS_ORDER.indexOf(status);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginTop: Space.lg }}>
      {STATUS_ORDER.map((s, i) => {
        const done = i <= currentIndex;
        const isCurrent = i === currentIndex;
        return (
          <View key={s} style={{ flex: 1, alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
              <View
                style={{
                  flex: 1,
                  height: 3,
                  backgroundColor: i === 0 ? 'transparent' : i <= currentIndex ? Palette.primary : Palette.border,
                }}
              />
              <TimelineDot done={done} current={isCurrent} index={i} />
              <View
                style={{
                  flex: 1,
                  height: 3,
                  backgroundColor:
                    i === STATUS_ORDER.length - 1 ? 'transparent' : i < currentIndex ? Palette.primary : Palette.border,
                }}
              />
            </View>
            <Text
              style={{ ...Type.tiny, fontSize: 9, color: done ? Palette.primary : Palette.textFaint, marginTop: 6, textAlign: 'center' }}>
              {STATUS_LABEL[s]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

function TimelineDot({ done, current, index }: { done: boolean; current: boolean; index: number }) {
  const pulse = useSharedValue(1);
  useEffect(() => {
    if (current) {
      pulse.value = withRepeat(withTiming(2, { duration: 1200, easing: Easing.out(Easing.ease) }), -1, false);
    }
  }, [current, pulse]);
  const ring = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: current ? Math.max(0, 1 - (pulse.value - 1)) * 0.45 : 0,
  }));
  const size = current ? 18 : 14;
  return (
    <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
      {current && (
        <Animated.View
          style={[
            { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: Palette.primary },
            ring,
          ]}
        />
      )}
      <Animated.View
        entering={done ? ZoomIn.delay(300 + index * 110).springify().damping(11) : undefined}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: done ? Palette.primary : Palette.surface,
          borderWidth: 2,
          borderColor: done ? Palette.primary : Palette.border,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {done && <Icon name="checkmark" set="ion" size={current ? 11 : 9} color="#fff" />}
      </Animated.View>
    </View>
  );
}

function EmptyState() {
  return (
    <View style={{ alignItems: 'center', paddingTop: Space.xxxl, paddingHorizontal: Space.xl }}>
      <View
        style={{
          width: 96,
          height: 96,
          borderRadius: 30,
          borderCurve: 'continuous',
          backgroundColor: Palette.primarySoft,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name="clipboard-text-outline" size={48} color={Palette.primary} />
      </View>
      <Text style={{ ...Type.h2, color: Palette.text, marginTop: Space.lg, textAlign: 'center' }}>
        Hələ müraciətiniz yoxdur
      </Text>
      <Text style={{ ...Type.body, color: Palette.textMuted, textAlign: 'center', marginTop: 6 }}>
        Şəhərdə gördüyünüz ilk problemi bildirin və xal qazanmağa başlayın.
      </Text>
    </View>
  );
}
