<?php

declare(strict_types=1);

namespace App\Http\Requests\Auth;

use App\Models\OneTimeCode;
use App\Models\User;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class CodeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'email' => 'required|string|max:255',
            'code' => 'required|string|max:6',
            'token' => 'required|string|max:32',
        ];
    }

    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        DB::transaction(function () {
            $data = $this->safe()->collect();

            $oneTimeCode = OneTimeCode::query()
                ->where($data->toArray())
                ->active()
                ->first();

            if ($oneTimeCode === null) {
                RateLimiter::hit($this->throttleKey());

                throw ValidationException::withMessages([
                    'code' => trans('Invalid code'),
                ]);
            }

            $account = $oneTimeCode->account;

            if ($account === null) {
                $account = User::query()->create([
                    'name' => $data->get('email'),
                    'email' => $data->get('email'),
                    'email_verified_at' => now(),
                    'password' => Hash::make(Str::random(32)),
                ]);

                event(new Registered($account));
            }

            Auth::login($account, true);

            $oneTimeCode->delete();
        });

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate('code|'.Str::lower($this->input('email')).'|'.$this->ip());
    }
}
