<?php

namespace App\Services;

use App\Data\ToDoListData;
use App\Models\TodoList;

class TodoListService
{
    public function getToDoLists() {
        return TodoList::with('todos')->get();
    }

    public function createToDoList(array $data) {
        return TodoList::create($data);
    }

    public function getToDoListsById(int $id) {
        return TodoList::with('todos')->findOrFail($id);
    }
    
    public function putToDoListsById(int $id, ToDoListData $data) {
        $list = TodoList::with('todos')->findOrFail($id);
        $list->update($data->toArray());
        return $list->fresh('todos');
    }
}
