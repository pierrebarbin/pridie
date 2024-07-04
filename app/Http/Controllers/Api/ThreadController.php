<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ThreadResource;
use App\Models\Thread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Spatie\QueryBuilder\QueryBuilder;

class ThreadController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection|JsonResponse
    {
        $threads = QueryBuilder::for(Thread::class)
            ->allowedFilters([
                'name',
            ])
            ->where('user_id', $request->user()->id)
            ->cursorPaginate(15);

        return ThreadResource::collection($threads);
    }
}
