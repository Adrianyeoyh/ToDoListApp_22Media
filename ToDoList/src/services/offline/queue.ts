import { readJson, writeJson } from './storage';
import { setSyncStatus } from './syncStatusStore';

export type ToDoChanges = { description?: string; is_done?: boolean };

export type PendingOperation =
  | { type: 'createToDoList'; tempId: number; name: string }
  | { type: 'updateToDoList'; id: number; name: string }
  | { type: 'deleteToDoList'; id: number }
  | { type: 'createToDo'; tempId: number; toDoListId: number; description: string }
  | { type: 'updateToDo'; id: number; changes: ToDoChanges }
  | { type: 'deleteToDo'; id: number };

const QUEUE_FILE = 'pending-operations.json';

let pendingOperations: PendingOperation[] | null = null;

export function getPendingOperations(): PendingOperation[] {
  pendingOperations ??= readJson<PendingOperation[]>(QUEUE_FILE, []);
  return pendingOperations;
}

export function savePendingOperations(operations: PendingOperation[]) {
  pendingOperations = operations;
  writeJson(QUEUE_FILE, operations);
  setSyncStatus({ pendingCount: operations.length });
}

export function enqueue(operation: PendingOperation) {
  savePendingOperations([...getPendingOperations(), operation]);
}

export function hasPendingOperations() {
  return getPendingOperations().length > 0;
}

// Items created offline get a negative id until the server assigns a real one.
export function createTempId() {
  return -Date.now() - Math.floor(Math.random() * 1000);
}

export function remapPendingOperationIds(resolvedIds: Map<number, number>) {
  const resolve = (id: number) => resolvedIds.get(id) ?? id;
  savePendingOperations(
    getPendingOperations().map((operation) => {
      switch (operation.type) {
        case 'createToDoList':
          return operation;
        case 'createToDo':
          return { ...operation, toDoListId: resolve(operation.toDoListId) };
        default:
          return { ...operation, id: resolve(operation.id) };
      }
    }),
  );
}
