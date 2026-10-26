import { getCachedList, getCachedToDo, removeCachedToDo, upsertCachedToDo } from '@/services/offline/cache';
import { createTempId, enqueue, type ToDoChanges } from '@/services/offline/queue';
import { resolveId } from '@/services/offline/sync';
import { tryCloud } from '@/services/offline/tryCloud';
import { assertValidText } from '@/services/offline/validation';
import * as ToDoService from '@/services/ToDoService';
import { ApiError } from '@/services/utils/api';
import type { ToDo } from '@/services/utils/types';

// Same functions as ToDoService, but they fall back to the local copy (and queue the change)
// when the server cannot be reached.

export async function createToDo(input: { to_do_list_id: string; description: string }): Promise<ToDo> {
  const toDoListId = resolveId(Number(input.to_do_list_id));
  const result = await tryCloud(() =>
    ToDoService.createToDo({ to_do_list_id: String(toDoListId), description: input.description }),
  );
  if (result.reachedCloud) {
    upsertCachedToDo(result.value);
    return result.value;
  }
  assertValidText('description', input.description);
  if (!getCachedList(toDoListId)) {
    throw new ApiError(404, { message: 'This list is not saved on this device.' });
  }
  const now = new Date().toISOString();
  const toDo: ToDo = {
    id: createTempId(),
    description: input.description,
    is_done: false,
    to_do_list_id: toDoListId,
    created_at: now,
    updated_at: now,
  };
  upsertCachedToDo(toDo);
  enqueue({ type: 'createToDo', tempId: toDo.id, toDoListId, description: input.description });
  return toDo;
}

export async function updateToDo(id: number, changes: ToDoChanges): Promise<ToDo> {
  const toDoId = resolveId(id);
  const result = await tryCloud(() => ToDoService.updateToDo(toDoId, changes));
  if (result.reachedCloud) {
    upsertCachedToDo(result.value);
    return result.value;
  }
  if (changes.description !== undefined) {
    assertValidText('description', changes.description);
  }
  const cached = getCachedToDo(toDoId);
  if (!cached) {
    throw new ApiError(404, { message: 'This to-do is not saved on this device.' });
  }
  const toDo = { ...cached, ...changes, updated_at: new Date().toISOString() };
  upsertCachedToDo(toDo);
  enqueue({ type: 'updateToDo', id: toDoId, changes });
  return toDo;
}

export async function deleteToDo(id: number): Promise<void> {
  const toDoId = resolveId(id);
  try {
    const result = await tryCloud(() => ToDoService.deleteToDo(toDoId));
    if (!result.reachedCloud) {
      enqueue({ type: 'deleteToDo', id: toDoId });
    }
  } catch (e) {
    if (!(e instanceof ApiError && e.status === 404)) {
      throw e;
    }
  }
  removeCachedToDo(toDoId);
}
