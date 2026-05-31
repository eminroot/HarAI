import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Palette, Type } from '@/constants/design';

SplashScreen.preventAutoHideAsync().catch(() => {});

const LOGO = require('@/assets/images/logo.png');
const LOGO_SIZE = 200;

/**
 * Smooth Spin + Reveal — the logo fades in, scales up while completing one
 * graceful spin, lands with a tiny pop-settle, then the wordmark/tagline
 * reveals beneath it. Finally the whole overlay lifts away to reveal the app.
 */
export function SplashGate({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(true);

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.6);
  const logoRotate = useSharedValue(0);
  const tagOpacity = useSharedValue(0);
  const tagY = useSharedValue(14);
  const overlayOpacity = useSharedValue(1);
  const overlayScale = useSharedValue(1);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});

    // fade in
    logoOpacity.value = withTiming(1, { duration: 450 });

    // one smooth full spin that decelerates as it lands
    logoRotate.value = withTiming(360, { duration: 1250, easing: Easing.inOut(Easing.cubic) });

    // grow during the spin, then a small pop + spring settle on landing
    logoScale.value = withSequence(
      withTiming(1, { duration: 1150, easing: Easing.out(Easing.cubic) }),
      withTiming(1.06, { duration: 150, easing: Easing.out(Easing.quad) }),
      withSpring(1, { damping: 6, stiffness: 220 })
    );

    // tagline reveals after the logo lands
    tagOpacity.value = withDelay(1050, withTiming(1, { duration: 500 }));
    tagY.value = withDelay(1050, withSpring(0, { damping: 15, stiffness: 130 }));

    // lift the overlay away → reveal the app
    const t = setTimeout(() => {
      overlayScale.value = withTiming(1.1, { duration: 560, easing: Easing.in(Easing.cubic) });
      overlayOpacity.value = withTiming(
        0,
        { duration: 560, easing: Easing.in(Easing.cubic) },
        (finished) => {
          if (finished) runOnJS(setShow)(false);
        }
      );
    }, 2350);

    return () => clearTimeout(t);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }, { rotate: `${logoRotate.value}deg` }],
  }));
  const tagStyle = useAnimatedStyle(() => ({
    opacity: tagOpacity.value,
    transform: [{ translateY: tagY.value }],
  }));
  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
    transform: [{ scale: overlayScale.value }],
  }));

  return (
    <View style={{ flex: 1 }}>
      {children}
      {show && (
        <Animated.View style={[StyleSheet.absoluteFill, overlayStyle, styles.overlay]}>
          <View style={styles.center}>
            <Animated.View style={logoStyle}>
              <Image
                source={LOGO}
                style={{ width: LOGO_SIZE, height: LOGO_SIZE }}
                resizeMode="contain"
              />
            </Animated.View>

            <Animated.View style={[tagStyle, styles.tagWrap]}>
              <Text style={styles.tagline}>NƏRİMANOV RAYONU</Text>
              <View style={styles.tagRule} />
              <Text style={styles.subtitle}>Rayonunuzun rəqəmsal səsi</Text>
            </Animated.View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { backgroundColor: '#FFFFFF', zIndex: 1000 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tagWrap: { alignItems: 'center', marginTop: 18 },
  tagline: {
    ...Type.small,
    color: Palette.primaryDark,
    letterSpacing: 4,
    fontWeight: '800',
  },
  tagRule: {
    width: 30,
    height: 3,
    borderRadius: 2,
    backgroundColor: Palette.primary,
    marginVertical: 10,
    opacity: 0.5,
  },
  subtitle: {
    ...Type.small,
    color: Palette.textMuted,
    letterSpacing: 0.3,
  },
});
