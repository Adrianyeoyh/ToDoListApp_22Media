import { request } from "./lib/api";
import { ToDoList } from "./lib/types";


export const getToDoLists = () => request<ToDoList[]>('/todo-lists');

export const getToDoList = (id: number) => request<ToDoList>(`/todo-lists/${id}`);

export const createToDoList = (name: string) =>
  request<ToDoList>('/todo-lists', { method: 'POST', body: JSON.stringify({ name }) });

export const updateToDoList = (id: number, name: string) =>
  request<ToDoList>(`/todo-lists/${id}`, { method: 'PUT', body: JSON.stringify({ name }) });

export const deleteToDoList = (id: number) =>
  request<void>(`/todo-lists/${id}`, { method: 'DELETE' });
