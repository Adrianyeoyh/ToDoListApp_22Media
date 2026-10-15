<?php

namespace App\Services;

use App\Data\RequestToDoListData;
use App\Models\ToDoList;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class TodoListService
{
    /**
     * @return Collection<int, ToDoList>
     */
    public function getToDoLists(): Collection
    {
        return ToDoList::with('todos')->get();
    }

    public function createToDoList(RequestToDoListData $data): ToDoList
    {
        return ToDoList::create($data->toArray());
    }

    public function getToDoListById(int $id): ToDoList
    {
        return ToDoList::with('todos')->findOrFail($id);
    }

    public function updateToDoListById(int $id, RequestToDoListData $data): ToDoList
    {
        $list = ToDoList::findOrFail($id);
        $list->update($data->toArray());

        return $list->fresh('todos');
    }

    public function deleteToDoListById(int $id): void
    {
        $list = ToDoList::findOrFail($id);
        DB::transaction(function () use ($list) {
            $list->todos()->delete();
            $list->delete();
        });
    }
}
