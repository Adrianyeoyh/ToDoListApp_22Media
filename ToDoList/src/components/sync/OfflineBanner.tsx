import { WifiOff } from 'lucide-react-native';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useSyncStatus } from '@/hooks/use-sync-status';

export default function OfflineBanner() {
  const { isOnline } = useSyncStatus();

  if (isOnline !== false) {
    return null;
  }

  return (
    <View className="mb-4 flex-row items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
      <WifiOff size={18} color="#b45309" />
      <View className="flex-1">
        <Text className="text-sm font-semibold text-amber-800">Couldn&apos;t connect to server</Text>
        <Text className="text-xs text-amber-700">You can keep going. Changes are saved on this device.</Text>
      </View>
    </View>
  );
}
