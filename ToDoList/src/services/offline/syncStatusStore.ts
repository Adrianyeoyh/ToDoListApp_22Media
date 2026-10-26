export type SyncStatus = {
  isOnline: boolean | null;
  pendingCount: number;
  isSyncing: boolean;
  syncVersion: number;
};

let status: SyncStatus = { isOnline: null, pendingCount: 0, isSyncing: false, syncVersion: 0 };
const listeners = new Set<() => void>();

export function getSyncStatus() {
  return status;
}

export function setSyncStatus(changes: Partial<SyncStatus>) {
  const next = { ...status, ...changes };
  const hasChanged = (Object.keys(changes) as (keyof SyncStatus)[]).some((key) => next[key] !== status[key]);
  if (!hasChanged) {
    return;
  }
  status = next;
  listeners.forEach((listener) => listener());
}

export function subscribeToSyncStatus(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
