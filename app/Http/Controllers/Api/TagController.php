<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TagResource;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class TagController extends Controller
{
    public function index(): AnonymousResourceCollection|JsonResponse
    {
        try {
            $tags = QueryBuilder::for(Tag::class)
                ->allowedFilters([
                    'label',
                ])
                ->cursorPaginate(15);

            return TagResource::collection($tags);
        } catch (Throwable $e) {
            report($e);

            return response()->json(status: 500);
        }
    }
}
