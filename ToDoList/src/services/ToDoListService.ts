import { request } from "./utils/api";
import { ToDoList } from "./utils/types";

export const getToDoLists = () => request<ToDoList[]>("/api/todo-lists");

export const getToDoList = (id: number) =>
  request<ToDoList>(`/api/todo-lists/${id}`);

export const createToDoList = (name: string) =>
  request<ToDoList>("/api/todo-lists", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const updateToDoList = (id: number, name: string) =>
  request<ToDoList>(`/api/todo-lists/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });

export const deleteToDoList = (id: number) =>
  request<void>(`/api/todo-lists/${id}`, { method: "DELETE" });
