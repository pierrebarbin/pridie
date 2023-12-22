<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleRequest;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Index');
    }

    public function store(ArticleRequest $request): RedirectResponse
    {
        Article::query()->create($request->safe()->all());

        return redirect()->back();
    }
}
