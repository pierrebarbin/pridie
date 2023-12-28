<?php

namespace App\Http\Controllers;

use App\Http\Requests\TagRequest;
use App\Models\Tag;
use Illuminate\Http\RedirectResponse;

class TagController extends Controller
{
    public function store(TagRequest $request): RedirectResponse
    {
        Tag::query()->create([
            'label' => $request->safe()->label
        ]);

        return redirect()->back();
    }

    public function destroy(Tag $tag): RedirectResponse
    {
        $tag->delete();

        return redirect()->back();
    }
}
