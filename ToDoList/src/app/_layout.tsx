import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ErrorModalProvider } from '@/components/feedback/ErrorModalProvider';
import '@/global.css';
import { PortalHost } from '@rn-primitives/portal';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ErrorModalProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ErrorModalProvider>
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
