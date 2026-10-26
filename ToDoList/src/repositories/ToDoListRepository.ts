import {
  getCachedList,
  getCachedLists,
  removeCachedList,
  saveCachedLists,
  upsertCachedList,
} from '@/services/offline/cache';
import { createTempId, enqueue } from '@/services/offline/queue';
import { resolveId } from '@/services/offline/sync';
import { tryCloud } from '@/services/offline/tryCloud';
import { assertValidText } from '@/services/offline/validation';
import * as ToDoListService from '@/services/ToDoListService';
import { ApiError } from '@/services/utils/api';
import type { ToDoList } from '@/services/utils/types';

// Same functions as ToDoListService, but they fall back to the local copy (and queue the change)
// when the server cannot be reached.

const notOnDevice = () => new ApiError(404, { message: 'This list is not saved on this device.' });

export async function getToDoLists(): Promise<ToDoList[]> {
  const result = await tryCloud(ToDoListService.getToDoLists);
  if (result.reachedCloud) {
    saveCachedLists(result.value);
    return result.value;
  }
  return getCachedLists();
}

export async function getToDoList(id: string): Promise<ToDoList> {
  const listId = resolveId(Number(id));
  const result = await tryCloud(() => ToDoListService.getToDoList(String(listId)));
  if (result.reachedCloud) {
    upsertCachedList(result.value);
    return result.value;
  }
  const toDoList = getCachedList(listId);
  if (!toDoList) {
    throw notOnDevice();
  }
  return toDoList;
}

export async function createToDoList(name: string): Promise<ToDoList> {
  const result = await tryCloud(() => ToDoListService.createToDoList(name));
  if (result.reachedCloud) {
    upsertCachedList(result.value);
    return result.value;
  }
  assertValidText('name', name);
  const now = new Date().toISOString();
  const toDoList: ToDoList = { id: createTempId(), name, created_at: now, updated_at: now, todos: [] };
  upsertCachedList(toDoList);
  enqueue({ type: 'createToDoList', tempId: toDoList.id, name });
  return toDoList;
}

export async function updateToDoList(id: string, name: string): Promise<ToDoList> {
  const listId = resolveId(Number(id));
  const result = await tryCloud(() => ToDoListService.updateToDoList(String(listId), name));
  if (result.reachedCloud) {
    upsertCachedList(result.value);
    return result.value;
  }
  assertValidText('name', name);
  const cached = getCachedList(listId);
  if (!cached) {
    throw notOnDevice();
  }
  const toDoList = { ...cached, name, updated_at: new Date().toISOString() };
  upsertCachedList(toDoList);
  enqueue({ type: 'updateToDoList', id: listId, name });
  return toDoList;
}

export async function deleteToDoList(id: string): Promise<void> {
  const listId = resolveId(Number(id));
  try {
    const result = await tryCloud(() => ToDoListService.deleteToDoList(String(listId)));
    if (!result.reachedCloud) {
      enqueue({ type: 'deleteToDoList', id: listId });
    }
  } catch (e) {
    if (!(e instanceof ApiError && e.status === 404)) {
      throw e;
    }
  }
  removeCachedList(listId);
}
