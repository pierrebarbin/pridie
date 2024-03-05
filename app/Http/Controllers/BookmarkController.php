<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\BookmarkRequest;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;

class BookmarkController extends Controller
{
    public function store(BookmarkRequest $request): RedirectResponse
    {
        $article = Article::query()->where('id', $request->safe()->article_id)->firstOrFail();

        $article->threads()->sync($request->safe()->threads);

        return redirect()->back();
    }
}
