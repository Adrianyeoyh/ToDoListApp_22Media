<?php

namespace App\Services;

use App\Data\ToDoListData;
use App\Models\TodoList;
use Illuminate\Support\Facades\DB;

class TodoListService
{
    public function getToDoLists() {
        return TodoList::with('todos')->get();
    }

    public function createToDoList(ToDoListData $data) {
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

    public function deleteToDoListById(int $id) {
        $list = TodoList::with('todos')->findOrFail($id);
        DB::transaction(function () use ($list) {
            $list->todos()->delete();
            $list->delete();
        });
        return ;
    }
}
