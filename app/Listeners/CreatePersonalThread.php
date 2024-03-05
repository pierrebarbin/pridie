<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Models\Thread;
use Illuminate\Auth\Events\Registered;

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
            'name' => 'Ma veille',
        ]));
    }
}
