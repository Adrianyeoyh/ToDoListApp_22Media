import { useEffect } from 'react';

import { useSyncStatus } from '@/hooks/use-sync-status';
import { isServerReachable } from '@/services/health';
import { getPendingOperations } from '@/services/offline/queue';
import { setSyncStatus } from '@/services/offline/syncStatusStore';

const ONLINE_PING_MS = 30_000;
const OFFLINE_PING_MS = 10_000;

// Pings the server in the background, faster while it is down, so the app notices when it comes back.
export function useServerHealth() {
  const { isOnline } = useSyncStatus();

  useEffect(() => {
    setSyncStatus({ pendingCount: getPendingOperations().length });
  }, []);

  useEffect(() => {
    let isActive = true;
    const ping = async () => {
      const isUp = await isServerReachable();
      if (isActive) {
        setSyncStatus({ isOnline: isUp });
      }
    };
    ping();
    const timer = setInterval(ping, isOnline === false ? OFFLINE_PING_MS : ONLINE_PING_MS);
    return () => {
      isActive = false;
      clearInterval(timer);
    };
  }, [isOnline]);
}
