import { Tabs } from 'expo-router';

import { TabBar } from '@/components/tab-bar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="map" />
      <Tabs.Screen name="humai" />
      <Tabs.Screen name="reports" />
      <Tabs.Screen name="leaderboard" />
    </Tabs>
  );
}
