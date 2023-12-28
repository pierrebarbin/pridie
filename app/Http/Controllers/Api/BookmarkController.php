<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookmarkRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    public function store(BookmarkRequest $request): JsonResponse
    {
        $state = $request->safe()->state;

        $method = $state ? 'attach' : 'detach';

        Auth::user()->bookmarks()->{$method}($request->safe()->article_id);

        return response()->json();
    }
}
