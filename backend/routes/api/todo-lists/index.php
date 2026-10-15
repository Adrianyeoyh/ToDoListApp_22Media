<?php

use App\Http\Controllers\ToDoListController;
use Illuminate\Support\Facades\Route;


Route::get('/', [ToDoListController::class, 'getToDoLists']);

Route::post('/', [ToDoListController::class, 'createToDoList']);  

Route::get('/{to_do_list_id}', [ToDoListController::class, 'getToDoListById'])
    ->whereNumber('to_do_list_id');

Route::put('/{to_do_list_id}', [ToDoListController::class, 'updateToDoListById'])
    ->whereNumber('to_do_list_id');

Route::delete('/{to_do_list_id}', [ToDoListController::class, 'deleteToDoListById'])
    ->whereNumber('to_do_list_id');
