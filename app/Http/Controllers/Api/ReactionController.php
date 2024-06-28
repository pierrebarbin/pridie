<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ReactionResource;
use App\Http\Resources\TagResource;
use App\Models\Reaction;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\QueryBuilder\QueryBuilder;
use Throwable;

class ReactionController extends Controller
{
    public function index(): AnonymousResourceCollection|JsonResponse
    {
        $reactions = QueryBuilder::for(Reaction::class)
            ->paginate(15);

        return ReactionResource::collection($reactions);
    }
}
