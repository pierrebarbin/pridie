<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ConfigUserTagRequest;
use App\Http\Requests\UserTagRequest;
use Illuminate\Http\RedirectResponse;

class UserTagController extends Controller
{
    public function store(ConfigUserTagRequest $request): RedirectResponse
    {
        $config = $request->user()->config;

        $config->use_default_tags = $request->safe()->state;

        $config->save();

        return redirect()->back();
    }

    public function update(UserTagRequest $request): RedirectResponse
    {
        $request->user()->defaultTags()->sync($request->safe()->tags);

        return redirect()->back();
    }
}
