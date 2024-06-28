<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ArticleRequest;
use App\Http\Resources\TagResource;
use App\Models\Article;
use App\Models\Reaction;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $config = $request->user()->config;

        return Inertia::render('Index', [
            'defaultTags' =>  fn () => $config->use_default_tags ? TagResource::collection($request->user()->defaultTags)->resolve($request) : [],
            'config' =>  fn () => [
                'useDefaultConfig' => $config->use_default_tags,
            ],
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
