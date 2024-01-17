<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\BookmarkController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReactionController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ThreadController;
use App\Http\Controllers\UserTagController;
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

    Route::get('/dashboard', function () {
        $tags = \App\Models\Tag::all();

        return Inertia::render('Dashboard', [
            'tags' => $tags
        ]);
    })->middleware('can:admin')->name('dashboard');

    Route::post('/articles', [ArticleController::class, 'store'])->name('articles.store');
    Route::post('/articles/{article}/reactions', [ReactionController::class, 'store'])
        ->name('reactions.store');

    Route::post('/tags', [TagController::class, 'store'])->name('tags.store');
    Route::post('/tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');

    Route::post('/threads', [ThreadController::class, 'store'])->name('threads.store');

    Route::post('/bookmark', [BookmarkController::class, 'store'])
        ->name('bookmark.store');

    Route::put('/config/tags', [UserTagController::class, 'update'])->name('config.tags.update');
    Route::post('/config/tags', [UserTagController::class, 'store'])->name('config.tags.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
