<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReactionRequest;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class ReactionController extends Controller
{
    public function store(ReactionRequest $request, Article $article): RedirectResponse
    {
        $article->reactions()
            ->wherePivot('user_id', Auth::user()->id)
            ->syncWithPivotValues($request->safe()->reactions, ['user_id' => Auth::user()->id]);

        return redirect()->back();
    }
}
