<?php

namespace App\Http\Controllers;

use App\Data\RequestToDoData;
use App\Data\RequestUpdateToDoData;
use App\Data\ToDoData;
use App\Services\TodoService;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ToDoController extends Controller
{
    
    public function __construct(private TodoService $service) {}
    /**
         * @return Collection<int, ToDoData>
     */
    public function getToDos(): Collection
    {
        return ToDoData::collect($this->service->getToDos());
    }

    public function createToDo(RequestToDoData $data): ToDoData
    {
        $list = $this->service->createToDo($data);

        return ToDoData::from($list);
    }

    public function getToDoById(int $id): ToDoData
    {
        $list = $this->service->getToDoById($id);

        return ToDoData::from($list);
    }

    public function updateToDoById(int $id, RequestUpdateToDoData $data): ToDoData
    {
        $list = $this->service->updateToDoById($id, $data);

        return ToDoData::from($list);
    }

    public function deleteToDoById(int $id): Response
    {
        $this->service->deleteToDoById($id);

        return response()->noContent();
    }
}
