<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\BookmarkRequest;
use Illuminate\Support\Facades\Auth;

class BookmarkController extends Controller
{
    public function store(BookmarkRequest $request)
    {
        Auth::user()->bookmarks()->toggle([$request->safe()->article_id]);

        return response()->json();
    }
}
