<?php

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\BookmarkController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/articles', [ArticleController::class, 'index'])->name('api.articles');
    Route::post('/bookmark', [BookmarkController::class, 'store'])->name('api.bookmark.store');
});
