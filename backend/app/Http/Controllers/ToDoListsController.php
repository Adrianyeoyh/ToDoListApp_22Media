<?php

namespace App\Http\Controllers;

use App\Data\ToDoListData;
use App\Http\Resources\TodoListResource;
use App\Models\TodoList;
use App\Services\TodoListService;
use Illuminate\Http\Request;

class ToDoListsController extends Controller
{
    public function __construct(private TodoListService $service) {}    
    
    public function getToDoLists() {
        return ToDoListData::collect($this->service->getToDoLists());
    }

    public function postToDoLists(ToDoListData $data) {
        $list = $this->service->createTodoList($data);
        return TodoListData::from($list->load('todos'));
    }

    public function getToDoListsById(int $id) {
        $list = $this->service->getToDoListsById($id);
        return ToDoListData::from($list->load('todos'));
    }

    public function putToDoListsById(int $id, ToDoListData $data) {
        $list = $this->service->putToDoListsById($id, $data);
        return ToDoListData::from($list->load('todos'));
    }

    public function deleteToDoListById(int $id) {
        $this->service->deleteToDoListById($id);
        return response()->noContent();
    }
}
