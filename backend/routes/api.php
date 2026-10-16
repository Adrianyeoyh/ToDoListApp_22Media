<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::prefix('/todo-lists')
    ->group(base_path('routes/api/todo-lists/index.php'));

Route::prefix('/todos')
    ->group(base_path('routes/api/todos/index.php'));
