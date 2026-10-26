import { isNetworkError } from '@/services/utils/api';
import { hasPendingOperations } from './queue';
import { getSyncStatus, setSyncStatus } from './syncStatusStore';

export type CloudResult<T> = { reachedCloud: true; value: T } | { reachedCloud: false };

// Sends a request to the server unless the app is offline or still has changes waiting to sync,
// in which case the caller should work on the local copy instead. Real API errors are still thrown.
export async function tryCloud<T>(send: () => Promise<T>): Promise<CloudResult<T>> {
  if (getSyncStatus().isOnline === false || hasPendingOperations()) {
    return { reachedCloud: false };
  }
  try {
    const value = await send();
    setSyncStatus({ isOnline: true });
    return { reachedCloud: true, value };
  } catch (e) {
    if (isNetworkError(e)) {
      setSyncStatus({ isOnline: false });
      return { reachedCloud: false };
    }
    throw e;
  }
}
