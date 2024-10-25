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
Route::post('/update_info',[UserController::class,'update']);
Route::middleware('auth:sanctum')->post('/logout', [UserController::class, 'logout']);

Route::post('list',[TagController::class,'index']);
Route::post('store_tag',[TagController::class,'store']);
Route::prefix('posts')->group(function() {
    Route::get('list',[PostController::class,'list']);
    Route::post('store',[PostController::class,'store']);
});
