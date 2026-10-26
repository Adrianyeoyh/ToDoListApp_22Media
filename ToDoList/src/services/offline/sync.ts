import { isServerReachable } from '@/services/health';
import * as ToDoListService from '@/services/ToDoListService';
import * as ToDoService from '@/services/ToDoService';
import { ApiError, isNetworkError } from '@/services/utils/api';
import type { ToDoList } from '@/services/utils/types';
import { getCachedLists, remapCachedIds, saveCachedLists } from './cache';
import {
  getPendingOperations,
  hasPendingOperations,
  remapPendingOperationIds,
  savePendingOperations,
  type PendingOperation,
} from './queue';
import { getSyncStatus, setSyncStatus } from './syncStatusStore';

const RETRY_INTERVAL_MS = 30_000;

const resolvedIds = new Map<number, number>();
let retryTimer: ReturnType<typeof setInterval> | null = null;

export type DataDifference = { onlyOnDevice: number; onlyOnCloud: number; changed: number };

export type SyncResult =
  | { status: 'busy' | 'offline' }
  | { status: 'synced' | 'retrying'; difference: DataDifference; failures: ApiError[] };

export function resolveId(id: number) {
  return resolvedIds.get(id) ?? id;
}

async function sendOperation(operation: PendingOperation) {
  switch (operation.type) {
    case 'createToDoList': {
      const toDoList = await ToDoListService.createToDoList(operation.name);
      resolvedIds.set(operation.tempId, toDoList.id);
      return;
    }
    case 'updateToDoList':
      await ToDoListService.updateToDoList(String(resolveId(operation.id)), operation.name);
      return;
    case 'deleteToDoList':
      await ToDoListService.deleteToDoList(String(resolveId(operation.id)));
      return;
    case 'createToDo': {
      const toDo = await ToDoService.createToDo({
        to_do_list_id: String(resolveId(operation.toDoListId)),
        description: operation.description,
      });
      resolvedIds.set(operation.tempId, toDo.id);
      return;
    }
    case 'updateToDo':
      await ToDoService.updateToDo(resolveId(operation.id), operation.changes);
      return;
    case 'deleteToDo':
      await ToDoService.deleteToDo(resolveId(operation.id));
      return;
  }
}

// Sends queued operations oldest first. Stops at the first network failure so the rest stay queued.
// Operations the server rejects can never succeed, so they are dropped and reported (404 means already gone).
async function replayQueue(): Promise<ApiError[]> {
  const failures: ApiError[] = [];
  while (hasPendingOperations()) {
    try {
      await sendOperation(getPendingOperations()[0]);
    } catch (e) {
      if (isNetworkError(e)) {
        break;
      }
      if (!(e instanceof ApiError)) {
        throw e;
      }
      if (e.status !== 404) {
        failures.push(e);
      }
    }
    savePendingOperations(getPendingOperations().slice(1));
  }
  remapCachedIds(resolvedIds);
  remapPendingOperationIds(resolvedIds);
  return failures;
}

function toEntries(lists: ToDoList[]) {
  return new Map<string, string>([
    ...lists.map((list): [string, string] => [`list:${list.id}`, list.name]),
    ...lists.flatMap((list) =>
      list.todos.map((toDo): [string, string] => [`todo:${toDo.id}`, `${toDo.description}|${toDo.is_done}`]),
    ),
  ]);
}

function compareData(deviceLists: ToDoList[], cloudLists: ToDoList[]): DataDifference {
  const device = toEntries(deviceLists);
  const cloud = toEntries(cloudLists);
  let onlyOnDevice = 0;
  let changed = 0;
  device.forEach((value, key) => {
    if (!cloud.has(key)) {
      onlyOnDevice++;
    } else if (cloud.get(key) !== value) {
      changed++;
    }
  });
  const onlyOnCloud = [...cloud.keys()].filter((key) => !device.has(key)).length;
  return { onlyOnDevice, onlyOnCloud, changed };
}

const isEqualised = (difference: DataDifference) =>
  difference.onlyOnDevice === 0 && difference.onlyOnCloud === 0 && difference.changed === 0;

function startRetrying() {
  retryTimer ??= setInterval(() => {
    syncNow();
  }, RETRY_INTERVAL_MS);
}

function stopRetrying() {
  if (retryTimer) {
    clearInterval(retryTimer);
    retryTimer = null;
  }
}

// Pushes queued changes to the server, then compares the device copy with the cloud copy.
// Equal: the app is backed up. Device ahead (changes still queued): retry on a timer until it catches up.
// Cloud ahead (nothing left to send): the cloud copy becomes the local copy.
export async function syncNow(): Promise<SyncResult> {
  if (getSyncStatus().isSyncing) {
    return { status: 'busy' };
  }
  setSyncStatus({ isSyncing: true });
  try {
    if (!(await isServerReachable())) {
      setSyncStatus({ isOnline: false });
      return { status: 'offline' };
    }
    setSyncStatus({ isOnline: true });

    const failures = await replayQueue();

    let cloudLists: ToDoList[];
    try {
      cloudLists = await ToDoListService.getToDoLists();
    } catch (e) {
      if (!isNetworkError(e)) {
        throw e;
      }
      setSyncStatus({ isOnline: false });
      startRetrying();
      return { status: 'offline' };
    }

    const difference = compareData(getCachedLists(), cloudLists);
    if (!isEqualised(difference) && hasPendingOperations()) {
      startRetrying();
      return { status: 'retrying', difference, failures };
    }

    stopRetrying();
    saveCachedLists(cloudLists);
    setSyncStatus({ syncVersion: getSyncStatus().syncVersion + 1 });
    return { status: 'synced', difference, failures };
  } finally {
    setSyncStatus({ isSyncing: false });
  }
}
