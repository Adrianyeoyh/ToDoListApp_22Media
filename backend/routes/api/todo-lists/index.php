<?php

use App\Http\Controllers\ToDoListsController;
use Illuminate\Support\Facades\Route;


// GET|HEAD api/todo-lists
Route::get('/', [ToDoListsController::class, 'getToDoLists']);

//POST api/todo-lists
Route::post('/', [ToDoListsController::class, 'postToDoLists']);  

//GET|HEAD api/todo-lists/{todo_list_id}
Route::get('/{to_do_list_id}', [ToDoListsController::class, 'getToDoListsById'])
    ->whereNumber('id');

// PUT|PATCH api/todo-lists/{todo_list_id}
Route::put('/{to_do_list_id}', [ToDoListsController::class, 'putToDoListsById'])
    ->whereNumber('id');