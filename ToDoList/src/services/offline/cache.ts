import type { ToDo, ToDoList } from '@/services/utils/types';
import { readJson, writeJson } from './storage';

const CACHE_FILE = 'todo-lists-cache.json';

let cachedLists: ToDoList[] | null = null;

export function getCachedLists(): ToDoList[] {
  cachedLists ??= readJson<ToDoList[]>(CACHE_FILE, []);
  return cachedLists;
}

export function saveCachedLists(lists: ToDoList[]) {
  cachedLists = lists;
  writeJson(CACHE_FILE, lists);
}

export function getCachedList(id: number): ToDoList | null {
  return getCachedLists().find((list) => list.id === id) ?? null;
}

export function upsertCachedList(toDoList: ToDoList) {
  const lists = getCachedLists();
  const exists = lists.some((list) => list.id === toDoList.id);
  saveCachedLists(exists ? lists.map((list) => (list.id === toDoList.id ? toDoList : list)) : [toDoList, ...lists]);
}

export function removeCachedList(id: number) {
  saveCachedLists(getCachedLists().filter((list) => list.id !== id));
}

export function getCachedToDo(id: number): ToDo | null {
  for (const list of getCachedLists()) {
    const toDo = list.todos.find((item) => item.id === id);
    if (toDo) {
      return toDo;
    }
  }
  return null;
}

export function upsertCachedToDo(toDo: ToDo) {
  saveCachedLists(
    getCachedLists().map((list) => {
      if (list.id !== toDo.to_do_list_id) {
        return list;
      }
      const exists = list.todos.some((item) => item.id === toDo.id);
      return {
        ...list,
        todos: exists ? list.todos.map((item) => (item.id === toDo.id ? toDo : item)) : [...list.todos, toDo],
      };
    }),
  );
}

export function removeCachedToDo(id: number) {
  saveCachedLists(getCachedLists().map((list) => ({ ...list, todos: list.todos.filter((item) => item.id !== id) })));
}

// Swaps the temporary ids of items created offline for the ids the server gave them.
export function remapCachedIds(resolvedIds: Map<number, number>) {
  const resolve = (id: number) => resolvedIds.get(id) ?? id;
  saveCachedLists(
    getCachedLists().map((list) => ({
      ...list,
      id: resolve(list.id),
      todos: list.todos.map((toDo) => ({ ...toDo, id: resolve(toDo.id), to_do_list_id: resolve(toDo.to_do_list_id) })),
    })),
  );
}
