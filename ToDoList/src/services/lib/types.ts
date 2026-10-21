export type ToDo = {
  id: number;
  description: string;
  is_done: boolean;
  to_do_list_id: number;
  created_at: string;
  updated_at: string;
};

export type ToDoList = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  todos: ToDo[];
};

export type ApiErrorBody = {
  message: string;
  errors?: Record<string, string[]>;
};
