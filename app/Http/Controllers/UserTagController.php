<?php

namespace App\Http\Controllers;

use App\Http\Requests\UserTagRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class UserTagController extends Controller
{
    public function update(UserTagRequest $request): RedirectResponse
    {
        $request->user()->defaultTags()->sync($request->safe()->tags);

        return redirect()->back();
    }
}
