import { CloudDownload } from 'lucide-react-native';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { useErrorModal } from '@/components/feedback/ErrorModalProvider';
import { Text } from '@/components/ui/text';
import { useSyncStatus } from '@/hooks/use-sync-status';
import { syncNow } from '@/services/offline/sync';

export default function SyncStatus() {
  const { showError } = useErrorModal();
  const { isOnline, pendingCount, isSyncing } = useSyncStatus();

  if (isOnline === null) {
    return null;
  }

  if (isOnline && pendingCount === 0) {
    return <Text className="text-xs text-muted-foreground">Saved on Cloud</Text>;
  }

  const handleSync = async () => {
    const result = await syncNow();
    if ((result.status === 'synced' || result.status === 'retrying') && result.failures.length > 0) {
      showError(result.failures[0]);
    }
  };

  return (
    <View className="flex-row items-center gap-2">
      <Text className="text-xs text-muted-foreground">Saved Locally</Text>
      <Pressable onPress={handleSync} disabled={isSyncing} hitSlop={8} className="active:opacity-60">
        {isSyncing ? <ActivityIndicator size="small" /> : <CloudDownload size={18} color="#737373" />}
      </Pressable>
    </View>
  );
}
