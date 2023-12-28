<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TagController;
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
    Route::get('/', [ArticleController::class, 'index']);

    Route::get('/dashboard', function () {
        $tags = \App\Models\Tag::all();

        return Inertia::render('Dashboard', [
            'tags' => $tags
        ]);
    })->middleware('can:admin')->name('dashboard');

    Route::post('/articles', [ArticleController::class, 'store']);
    Route::post('/tags', [TagController::class, 'store'])->name('tags.store');
    Route::post('/tags/{tag}', [TagController::class, 'destroy'])->name('tags.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
