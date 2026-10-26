import { useSyncExternalStore } from 'react';

import { getSyncStatus, subscribeToSyncStatus } from '@/services/offline/syncStatusStore';

export function useSyncStatus() {
  return useSyncExternalStore(subscribeToSyncStatus, getSyncStatus);
}
