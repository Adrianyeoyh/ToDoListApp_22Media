<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/health', fn () => ['status' => 'up']);
Route::prefix('/todo-lists')
    ->group(base_path('routes/api/todo-lists/index.php'));
