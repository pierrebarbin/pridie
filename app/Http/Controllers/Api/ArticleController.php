<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class ArticleController extends Controller
{
    public function index(): AnonymousResourceCollection|JsonResponse
    {
        try {
            $articles = QueryBuilder::for(Article::class)
                ->defaultSorts(['-created_at'])
                ->allowedFilters([
                    'title',
                    AllowedFilter::scope('tags','by_tags'),
                    AllowedFilter::scope('bookmark','show_bookmark'),
                ])
                ->with(['articleReactions', 'userReactions'])
                ->cursorPaginate(20);

            return ArticleResource::collection($articles);
        } catch (Throwable $e) {
            report($e);
            return response()->json(status: 500);
        }
    }
}
