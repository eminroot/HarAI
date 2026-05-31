import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SplashGate } from '@/components/splash-gate';
import { Palette } from '@/constants/design';
import { ReportsProvider } from '@/lib/store';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Palette.bg }}>
      <SafeAreaProvider>
        <ReportsProvider>
          <SplashGate>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: Palette.bg },
              }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="report/new"
                options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
              />
            </Stack>
          </SplashGate>
          <StatusBar style="dark" />
        </ReportsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
