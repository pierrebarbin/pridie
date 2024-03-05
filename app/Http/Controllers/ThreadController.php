<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\ThreadRequest;
use App\Models\Thread;
use Illuminate\Http\RedirectResponse;

class ThreadController extends Controller
{
    public function store(ThreadRequest $request): RedirectResponse
    {
        Thread::query()->create([
            ...$request->safe()->all(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->back();
    }

    public function update(Thread $thread)
    {

        return redirect()->back();
    }

    public function destroy(Thread $thread): RedirectResponse
    {
        $thread->delete();

        return redirect()->back();
    }
}
