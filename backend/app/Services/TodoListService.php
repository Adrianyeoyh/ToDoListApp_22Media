<?php

namespace App\Services;

use App\Data\RequestToDoListData;
use App\Models\TodoList;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class TodoListService
{
    /**
     * @return Collection<int, TodoList>
     */
    public function getToDoLists(): Collection
    {
        return TodoList::with('todos')->get();
    }

    public function createToDoList(RequestToDoListData $data): TodoList
    {
        return TodoList::create($data->toArray());
    }

    public function getToDoListsById(int $id): TodoList
    {
        return TodoList::with('todos')->findOrFail($id);
    }

    public function putToDoListsById(int $id, RequestToDoListData $data): TodoList
    {
        $list = TodoList::findOrFail($id);
        $list->update($data->toArray());

        return $list->fresh('todos');
    }

    public function deleteToDoListById(int $id): void
    {
        $list = TodoList::findOrFail($id);
        DB::transaction(function () use ($list) {
            $list->todos()->delete();
            $list->delete();
        });
    }
}
