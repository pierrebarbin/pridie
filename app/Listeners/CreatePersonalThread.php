<?php

namespace App\Listeners;

use App\Models\Thread;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CreatePersonalThread
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        $event->user->threads()->save(new Thread([
            'name' => 'Ma veille'
        ]));
    }
}
