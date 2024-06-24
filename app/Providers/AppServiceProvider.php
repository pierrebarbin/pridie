<?php

declare(strict_types=1);

namespace App\Providers;

use App\Listeners\CreateAccountConfig;
use App\Listeners\CreatePersonalThread;
use App\Listeners\LinkDefaultTagsToAccount;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
