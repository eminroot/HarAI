import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Text, TextStyle, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

/**
 * Count-up number. Isolated component so only it re-renders each frame
 * (the parent screen is untouched). Eases out cubic.
 */
export function CountUp({
  value,
  duration = 1300,
  delay = 0,
  style,
}: {
  value: number;
  duration?: number;
  delay?: number;
  style?: TextStyle | TextStyle[];
}) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const startAt = Date.now() + delay;
    const tick = () => {
      const now = Date.now();
      if (now < startAt) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const t = Math.min(1, (now - startAt) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration, delay]);

  return <Text style={style}>{display}</Text>;
}

/**
 * Diagonal light sweep that periodically glides across its parent.
 * Place inside a container with overflow:'hidden'.
 */
export function Shine({
  delay = 800,
  period = 3600,
  color = 'rgba(255,255,255,0.35)',
}: {
  delay?: number;
  period?: number;
  color?: string;
}) {
  const [w, setW] = useState(0);
  const tx = useSharedValue(-120);

  useEffect(() => {
    if (!w) return;
    tx.value = -120;
    tx.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(w + 120, { duration: 1100, easing: Easing.inOut(Easing.ease) }),
          withTiming(w + 120, { duration: period })
        ),
        -1
      )
    );
  }, [w, delay, period, tx]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { rotate: '20deg' }],
  }));

  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);

  return (
    <View
      pointerEvents="none"
      onLayout={onLayout}
      style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden' }}>
      <Animated.View style={[{ position: 'absolute', top: -40, bottom: -40, width: 70 }, style]}>
        <LinearGradient
          colors={['transparent', color, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

/** A pedestal bar that springs up from zero height. */
export function PedestalBar({
  target,
  gradient,
  delay = 0,
}: {
  target: number;
  gradient: readonly [string, string, ...string[]];
  delay?: number;
}) {
  const h = useSharedValue(0);
  useEffect(() => {
    h.value = withDelay(delay, withTiming(target, { duration: 700, easing: Easing.out(Easing.cubic) }));
  }, [target, delay, h]);
  const style = useAnimatedStyle(() => ({ height: h.value }));
  return (
    <Animated.View
      style={[
        { width: '86%', borderTopLeftRadius: 14, borderTopRightRadius: 14, marginTop: 10, overflow: 'hidden' },
        style,
      ]}>
      <LinearGradient colors={gradient} style={{ flex: 1 }} />
    </Animated.View>
  );
}

/** Gentle continuous bob + tilt, used for the winner's crown. */
export function Bob({ children, amount = 4 }: { children: React.ReactNode; amount?: number }) {
  const y = useSharedValue(0);
  useEffect(() => {
    y.value = withRepeat(
      withSequence(
        withTiming(-amount, { duration: 720, easing: Easing.inOut(Easing.ease) }),
        withTiming(amount * 0.5, { duration: 720, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, [amount, y]);
  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: y.value }, { rotate: `${y.value * 0.6}deg` }],
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
}
