<?php

declare(strict_types=1);

use App\Http\Controllers\Api\ArticleController;
use App\Http\Controllers\Api\TagController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/articles', [ArticleController::class, 'index'])
        ->name('api.articles');

        Route::get('/tags', [TagController::class, 'index'])
        ->name('api.tags');
});
