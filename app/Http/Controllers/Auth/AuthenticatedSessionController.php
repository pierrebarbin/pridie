<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\CodeRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\OneTimeCode;
use App\Notifications\SendOneTimeCodeNotification;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->ensureIsNotRateLimited();

        $email = str($request->safe()->name)->append('@glanum.com')->toString();

        $oneTimeCode = OneTimeCode::query()
            ->where('email', $email)
            ->active()
            ->first();

        if ($oneTimeCode !== null) {
            return redirect()->temporarySignedRoute('code', $oneTimeCode->expire_at, [
                'email' => $email,
                'token' => $oneTimeCode->token
            ]);
        }

        $token = Str::random(32);

        $oneTimeCode = OneTimeCode::query()->create([
            'email' => $email,
            'code' => str((string) rand(1, 999999))->padLeft(6, '0'),
            'expire_at' => now()->addMinutes(15),
            'token' => $token
        ]);

        $oneTimeCode->notify(new SendOneTimeCodeNotification());

        return redirect()->temporarySignedRoute('code', now()->addMinutes(10), [
            'email' => $email,
            'token' => $token
        ]);
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('Auth/Code', [
            'email' => $request->get('email'),
            'token' => $request->get('token')
        ]);
    }

    public function update(CodeRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        return redirect()->intended(RouteServiceProvider::HOME);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
