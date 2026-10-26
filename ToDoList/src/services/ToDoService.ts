import { request } from "./utils/api";
import { ToDo } from "./utils/types";

export const getToDos = () => request<ToDo[]>("/api/todos");

export const getToDo = (id: number) => request<ToDo>(`/api/todos/${id}`);

export const createToDo = (input: {
  to_do_list_id: string;
  description: string;
  is_done?: boolean;
}) =>
  request<ToDo>("/api/todos", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateToDo = (
  id: number,
  changes: {
    description?: string;
    is_done?: boolean;
  },
) =>
  request<ToDo>(`/api/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify(changes),
  });

export const deleteToDo = (id: number) =>
  request<void>(`/api/todos/${id}`, { method: "DELETE" });
