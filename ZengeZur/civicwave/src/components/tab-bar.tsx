import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui';
import { Gradients, Palette, Radius, Shadow, Type } from '@/constants/design';

const AView = Animated.createAnimatedComponent(View);

type TabDef = { name: string; label: string; icon: string; iconActive: string };

const TABS: Record<string, TabDef> = {
  index: { name: 'index', label: 'Ana Səhifə', icon: 'home-outline', iconActive: 'home' },
  map: { name: 'map', label: 'Xəritə', icon: 'map-outline', iconActive: 'map' },
  humai: { name: 'humai', label: 'HarAI', icon: 'sparkles-outline', iconActive: 'sparkles' },
  reports: {
    name: 'reports',
    label: 'Müraciətlər',
    icon: 'document-text-outline',
    iconActive: 'document-text',
  },
  leaderboard: {
    name: 'leaderboard',
    label: 'Reytinq',
    icon: 'trophy-outline',
    iconActive: 'trophy',
  },
};

function TabItem({
  def,
  focused,
  onPress,
}: {
  def: TabDef;
  focused: boolean;
  onPress: () => void;
}) {
  const isHum = def.name === 'humai';
  const scale = useSharedValue(focused ? 1 : 0.92);
  useEffect(() => {
    scale.value = withSpring(focused ? 1 : 0.92, { damping: 14, stiffness: 220 });
  }, [focused, scale]);
  const aStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (isHum) {
    return (
      <Pressable onPress={onPress} style={{ flex: 1, alignItems: 'center' }}>
        <AView style={aStyle}>
          <LinearGradient
            colors={Gradients.ai}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              width: 54,
              height: 54,
              borderRadius: 27,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: -22,
              ...Shadow.raised,
            }}>
            <Icon name={focused ? 'sparkles' : 'sparkles-outline'} set="ion" size={26} color="#fff" />
          </LinearGradient>
        </AView>
        <Text
          style={{
            ...Type.tiny,
            fontSize: 10,
            color: focused ? Palette.ai1 : Palette.textMuted,
            marginTop: 3,
          }}>
          {def.label}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <AView style={[aStyle, { alignItems: 'center', gap: 3 }]}>
        <Icon
          name={focused ? def.iconActive : def.icon}
          set="ion"
          size={24}
          color={focused ? Palette.primary : Palette.textFaint}
        />
        <Text
          style={{
            ...Type.tiny,
            fontSize: 10,
            color: focused ? Palette.primary : Palette.textMuted,
          }}>
          {def.label}
        </Text>
      </AView>
    </Pressable>
  );
}

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: Math.max(insets.bottom, 10),
        paddingTop: 10,
        paddingHorizontal: 18,
        backgroundColor: Palette.surface,
        borderTopLeftRadius: Radius.xl,
        borderTopRightRadius: Radius.xl,
        borderCurve: 'continuous',
        flexDirection: 'row',
        ...Shadow.raised,
      }}>
      {state.routes.map((route, index) => {
        const def = TABS[route.name];
        if (!def) return null;
        const focused = state.index === index;
        const onPress = () => {
          Haptics.selectionAsync().catch(() => {});
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };
        return <TabItem key={route.key} def={def} focused={focused} onPress={onPress} />;
      })}
    </View>
  );
}
