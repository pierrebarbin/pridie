<?php

use App\Http\Controllers\Api\ArticleController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/articles', [ArticleController::class, 'index'])
        ->name('api.articles');
});
