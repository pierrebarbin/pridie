<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(): Response
    {
        $tags = Tag::all();

        return Inertia::render('Index', [
            'tags' => $tags
        ]);
    }

    public function store(ArticleRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request) {
            $article = Article::query()->create($request->safe()->except('tags'));

            $article->tags()->sync($request->safe()->tags);
        });

        return redirect()->back();
    }
}
