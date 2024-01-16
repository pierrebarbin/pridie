<?php

namespace App\Http\Controllers;

use App\Http\Requests\ArticleRequest;
use App\Http\Resources\ArticleResource;
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
        $tags = Tag::all();

        $selectedTagsId = Arr::get($request->query('filter', []), 'tags', '');
        $selectedTags = $tags
            ->whereIn('id', explode(',', $selectedTagsId))
            ->map(fn($item) => ['key' => $item->id, 'value' => $item->label])
            ->toArray();

        $params = $request->query();

        Arr::set($params, 'filter.tags', $selectedTags);

        return Inertia::render('Index', [
            'tags' => $tags,
            'filters' => $params,
            'reactions' => $reactions,
            'threads' => $request->user()->threads,
            'defaultTags' => $config->use_default_tags ? $request->user()->defaultTags : [],
            'config' => $config
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
