<?php

use App\Http\Controllers\v1\api\PostController;
use App\Http\Controllers\v1\api\TagController;
use App\Http\Controllers\v1\api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

//  get list and profile user
Route::prefix('user')->group(function () {
    Route::get('list', [UserController::class, 'list']);
    Route::get('profile', [UserController::class, 'profile']);
    Route::post('update', [UserController::class, 'update']);
    Route::post('update-password', [UserController::class, 'update_password']);
});
Route::post('/logout', [UserController::class, 'logout']);

// tags route
Route::get('tag', [TagController::class, 'index']);
Route::post('tag', [TagController::class, 'store']);


Route::prefix('posts')->group(function () {
    Route::get('/', [PostController::class, 'list']);
    Route::get('/detail', [PostController::class, 'detail']);
    Route::post('/', [PostController::class, 'store']);
    Route::post('/update', [PostController::class, 'update']);
    Route::post('/delete', [PostController::class, 'delete']);
});
