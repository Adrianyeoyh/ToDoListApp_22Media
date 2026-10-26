<?php

namespace App\Services;

use App\Data\RequestToDoData;
use App\Data\RequestUpdateToDoData;
use App\Models\ToDo;
use Illuminate\Database\Eloquent\Collection;

class TodoService
{
    /**
     * @return Collection<int, ToDo>
     */
    public function getToDos(): Collection
    {
        return ToDo::all();
    }

    public function createToDo(RequestToDoData $data): ToDo
    {
        return ToDo::create($data->toArray());
    }

    public function getToDoById(int $id): ToDo
    {
        return ToDo::findOrFail($id);
    }

    public function updateToDoById(int $id, RequestUpdateToDoData $data): ToDo
    {
        $list = ToDo::findOrFail($id);
        $list->update($data->toArray());
        return $list->fresh();
    }

    public function deleteToDoById(int $id): void
    {
        $list = ToDo::findOrFail($id);
        $list->delete();
    }
}
