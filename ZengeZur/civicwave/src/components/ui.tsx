import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, PressableProps, Text, View, ViewProps } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { IconSet, Severity, SEVERITY_LABEL } from '@/constants/categories';
import { Palette, Radius, Shadow, Space, Type } from '@/constants/design';

const AView = Animated.createAnimatedComponent(View);

export function Icon({
  name,
  set = 'mci',
  size = 22,
  color = Palette.text,
}: {
  name: string;
  set?: IconSet;
  size?: number;
  color?: string;
}) {
  if (set === 'ion') {
    return <Ionicons name={name as any} size={size} color={color} />;
  }
  return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
}

export function Card({ style, children, ...rest }: ViewProps) {
  return (
    <View
      style={[
        {
          backgroundColor: Palette.surface,
          borderRadius: Radius.lg,
          borderCurve: 'continuous',
          padding: Space.lg,
          ...Shadow.card,
        },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        ...Type.tiny,
        color: Palette.textMuted,
        textTransform: 'uppercase',
        marginBottom: Space.md,
        marginTop: Space.xl,
        marginLeft: Space.xs,
      }}>
      {children}
    </Text>
  );
}

export function SeverityBadge({ severity, small }: { severity: Severity; small?: boolean }) {
  const map = {
    low: { c: Palette.low, bg: Palette.lowSoft },
    medium: { c: Palette.medium, bg: Palette.mediumSoft },
    critical: { c: Palette.critical, bg: Palette.criticalSoft },
  }[severity];
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: map.bg,
        paddingHorizontal: small ? 8 : 10,
        paddingVertical: small ? 3 : 5,
        borderRadius: Radius.pill,
      }}>
      <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: map.c }} />
      <Text style={{ ...Type.tiny, fontSize: small ? 10 : 11, color: map.c }}>
        {SEVERITY_LABEL[severity].toUpperCase()}
      </Text>
    </View>
  );
}

export function Pill({
  label,
  icon,
  iconSet,
  color = Palette.primary,
  active,
  onPress,
}: {
  label: string;
  icon?: string;
  iconSet?: IconSet;
  color?: string;
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: Radius.pill,
        backgroundColor: active ? color : Palette.surface,
        borderWidth: 1,
        borderColor: active ? color : Palette.border,
      }}>
      {icon && <Icon name={icon} set={iconSet} size={15} color={active ? '#fff' : color} />}
      <Text style={{ ...Type.small, color: active ? '#fff' : Palette.text }}>{label}</Text>
    </Pressable>
  );
}

/** Bouncy, haptic press wrapper used everywhere for that "smooth" feel. */
export function Tap({
  onPress,
  style,
  children,
  scaleTo = 0.96,
  haptic = true,
  disabled,
  ...rest
}: PressableProps & { scaleTo?: number; haptic?: boolean }) {
  const s = useSharedValue(1);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: s.value }] }));
  return (
    <AView style={[aStyle, style as any]}>
      <Pressable
        disabled={disabled}
        onPressIn={() => {
          s.value = withSpring(scaleTo, { damping: 18, stiffness: 320 });
        }}
        onPressOut={() => {
          s.value = withSpring(1, { damping: 14, stiffness: 260 });
        }}
        onPress={(e) => {
          if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
          onPress?.(e);
        }}
        {...rest}>
        {children as any}
      </Pressable>
    </AView>
  );
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  loading,
  disabled,
  gradient = [Palette.primary, Palette.primaryDark],
}: {
  label: string;
  onPress?: () => void;
  icon?: string;
  loading?: boolean;
  disabled?: boolean;
  gradient?: readonly [string, string, ...string[]];
}) {
  return (
    <Tap
      onPress={disabled || loading ? undefined : onPress}
      disabled={disabled || loading}
      style={{ opacity: disabled ? 0.5 : 1 }}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: 56,
          borderRadius: Radius.md,
          borderCurve: 'continuous',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 9,
          ...Shadow.raised,
        }}>
        {loading ? (
          <Spinner />
        ) : (
          <>
            {icon && <Icon name={icon} set="ion" size={20} color="#fff" />}
            <Text style={{ ...Type.h3, color: '#fff' }}>{label}</Text>
          </>
        )}
      </LinearGradient>
    </Tap>
  );
}

/** Reusable continuous rotation animated style (infinite linear spin). */
export function useSpin(duration = 1000) {
  const rot = useSharedValue(0);
  useEffect(() => {
    rot.value = withRepeat(withTiming(360, { duration, easing: Easing.linear }), -1);
  }, [rot, duration]);
  return useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));
}

export function Spinner({ size = 22, color = '#fff' }: { size?: number; color?: string }) {
  const spin = useSpin(850);
  return (
    <AView
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: Math.max(2, size / 9),
          borderColor: 'rgba(255,255,255,0.35)',
          borderTopColor: color,
        },
        spin,
      ]}
    />
  );
}
