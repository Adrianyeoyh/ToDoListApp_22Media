<?php

namespace App\Http\Controllers;

use App\Http\Resources\TodoListResource;
use App\Services\TodoListService;
use Illuminate\Http\Request;

class ToDoListsController extends Controller
{
    public function __construct(private TodoListService $service) {}    
    //
    public function getToDoLists() {
        return TodoListResource::collection($this->service->getToDoLists());
    }

    public function postTodoLists(Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $list = $this->service->createTodoList($data);

        return (new TodoListResource($list))->response()->setStatusCode(201);
    }
}
