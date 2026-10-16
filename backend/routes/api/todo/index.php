<?php

use App\Http\Controllers\ToDoController;
use Illuminate\Support\Facades\Route;


Route::get('/', [ToDoController::class, 'getToDos']);

Route::post('/', [ToDoController::class, 'createToDo']);  

Route::get('/{to_do_id}', [ToDoController::class, 'getToDoById'])
    ->whereNumber('to_do_id');

Route::put('/{to_do_id}', [ToDoController::class, 'updateToDoListById'])
    ->whereNumber('to_do_id');

Route::delete('/{to_do_id}', [ToDoController::class, 'deleteToDoListById'])
    ->whereNumber('to_do_id');
