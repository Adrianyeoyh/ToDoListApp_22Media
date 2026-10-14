<?php

use App\Http\Controllers\ToDoListsController;
use Illuminate\Support\Facades\Route;


// GET|HEAD api/todo-lists
Route::get('/', [ToDoListsController::class, 'getToDoLists']);

//POST api/todo-lists
Route::post('/', );  

//GET|HEAD api/todo-lists/{todo_list_id}
Route::get('/{to_do_list_id}',);

//POST api/todo-lists/{todo_list_id}
Route::post('/{to_do_list_id}',);