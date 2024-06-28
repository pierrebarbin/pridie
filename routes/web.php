<?php

declare(strict_types=1);

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ThreadController;
use App\Http\Controllers\UserTagController;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::middleware('auth')->group(function () {
    Route::get('/', [ArticleController::class, 'index'])->name('home');



    Route::post('/articles/{article}/reactions', [ReactionController::class, 'store'])
        ->name('reactions.store');
    Route::post('/bookmark', [BookmarkController::class, 'store'])
        ->name('bookmark.store');

    Route::put('/config/tags', [UserTagController::class, 'update'])->name('config.tags.update');
    Route::post('/config/tags', [UserTagController::class, 'store'])->name('config.tags.store');

    Route::middleware('can:admin')->group(function () {
        Route::get('/dashboard', function () {
            $tags = \App\Models\Tag::all();

            return Inertia::render('Dashboard', [
                'tags' => $tags,
            ]);
        })->name('dashboard');

        Route::post('/articles', [ArticleController::class, 'store'])->name('articles.store');

        Route::post('/tags', [TagController::class, 'store'])->name('tags.store');
        Route::post('/tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');

        Route::post('/threads', [ThreadController::class, 'store'])->name('threads.store');
        Route::delete('/threads/{thread}', [ThreadController::class, 'destroy'])->name('threads.destroy');
    });
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::withoutMiddleware(HandleInertiaRequests::class)
    ->middleware('auth')
    ->prefix('api')
    ->group(function () {
        Route::get('/articles', [App\Http\Controllers\Api\ArticleController::class, 'index'])
            ->name('api.articles');

        Route::get('/tags', [App\Http\Controllers\Api\TagController::class, 'index'])
            ->name('api.tags');

        Route::get('/threads', [App\Http\Controllers\Api\ThreadController::class, 'index'])
            ->name('api.threads');

        Route::get('/reactions', [App\Http\Controllers\Api\ReactionController::class, 'index'])
            ->name('api.reactions');
});


require __DIR__.'/auth.php';
