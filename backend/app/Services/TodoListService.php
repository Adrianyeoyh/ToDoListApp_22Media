<?php

namespace App\Services;

use App\Models\TodoList;

class TodoListService
{
    public function getToDoLists() {
        return TodoList::with('todos')->get();
    }

    public function createToDoList(array $data) {
        return TodoList::create($data);
    }
}
