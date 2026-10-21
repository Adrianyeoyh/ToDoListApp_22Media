import { request } from "./lib/api";
import { ToDo } from "./lib/types";


export const createToDo = (input: { to_do_list_id: number; description: string; is_done?: boolean }) =>
  request<ToDo>('/todos', { method: 'POST', body: JSON.stringify(input) });

export const updateToDo = (id: number, changes: { description?: string; is_done?: boolean }) =>
  request<ToDo>(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(changes) });

export const deleteToDo = (id: number) => request<void>(`/todos/${id}`, { method: 'DELETE' });