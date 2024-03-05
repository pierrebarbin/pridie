<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Models\Config;
use Illuminate\Auth\Events\Registered;

class CreateAccountConfig
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
        $event->user->config()->save(new Config());
    }
}
