<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

use function Pest\Laravel\json;

class ArticleController extends Controller
{
    public function index(): AnonymousResourceCollection|JsonResponse
    {
        try {
            $articles = QueryBuilder::for(Article::class)
                ->defaultSorts(['-created_at'])
                ->paginate(10);

            return ArticleResource::collection($articles);
        } catch (Throwable $e) {
            report($e);
            return response()->json(status: 500);
        }
    }
}
