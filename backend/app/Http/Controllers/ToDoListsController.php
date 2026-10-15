<?php

namespace App\Http\Controllers;

use App\Data\RequestToDoListData;
use App\Data\ToDoListData;
use App\Services\TodoListService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Collection;

class ToDoListsController extends Controller
{
    public function __construct(private TodoListService $service) {}

    /**
     * @return Collection<int, ToDoListData>
     */
    public function getToDoLists(): Collection
    {
        return ToDoListData::collect($this->service->getToDoLists());
    }

    public function postToDoLists(RequestToDoListData $data): JsonResponse
    {
        $list = $this->service->createToDoList($data);

        return ToDoListData::from($list->load('todos'))
            ->toResponse(request())
            ->setStatusCode(Response::HTTP_CREATED);
    }

    public function getToDoListsById(int $id): ToDoListData
    {
        $list = $this->service->getToDoListsById($id);

        return ToDoListData::from($list);
    }

    public function putToDoListsById(int $id, RequestToDoListData $data): ToDoListData
    {
        $list = $this->service->putToDoListsById($id, $data);

        return ToDoListData::from($list);
    }

    public function deleteToDoListsById(int $id): Response
    {
        $this->service->deleteToDoListById($id);

        return response()->noContent();
    }
}
