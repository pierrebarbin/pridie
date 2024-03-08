<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ArticleRequest;
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
        $reactions = Reaction::all();

        $selectedTagsId = Arr::get($request->query('filter', []), 'tags', '');
        $selectedTags = Tag::query()
            ->whereIn('id', explode(',', $selectedTagsId))
            ->get()
            ->map(fn ($item) => ['key' => $item->id, 'value' => $item->label])
            ->toArray();

        $params = $request->query();

        Arr::set($params, 'filter.tags', $selectedTags);

        return Inertia::render('Index', [
            'filters' =>  fn () => $params,
            'reactions' =>  fn () => $reactions,
            'threads' =>  fn () => $request->user()->threads,
            'defaultTags' =>  fn () => $config->use_default_tags ? $request->user()->defaultTags : [],
            'config' =>  fn () => $config,
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
