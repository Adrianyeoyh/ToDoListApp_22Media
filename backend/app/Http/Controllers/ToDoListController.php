<?php

namespace App\Http\Controllers;

use App\Data\RequestToDoListData;
use App\Data\ToDoListData;
use App\Services\TodoListService;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;

class ToDoListController extends Controller
{
    public function __construct(private TodoListService $service) {}

    /**
     * @return Collection<int, ToDoListData>
     */
    public function getToDoLists(): Collection
    {
        return ToDoListData::collect($this->service->getToDoLists());
    }

    public function createToDoList(RequestToDoListData $data): ToDoListData
    {
        $list = $this->service->createToDoList($data);

        return ToDoListData::from($list->load('todos'));
    }

    public function getToDoListById(int $id): ToDoListData
    {
        $list = $this->service->getToDoListById($id);

        return ToDoListData::from($list);
    }

    public function updateToDoListById(int $id, RequestToDoListData $data): ToDoListData
    {
        $list = $this->service->updateToDoListById($id, $data);

        return ToDoListData::from($list);
    }

    public function deleteToDoListById(int $id): Response
    {
        $this->service->deleteToDoListById($id);

        return response()->noContent();
    }
}
