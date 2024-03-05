<?php

declare(strict_types=1);

namespace App\Http\Requests;

use App\Models\Article;
use App\Models\Thread;
use Closure;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class BookmarkRequest extends FormRequest
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
            'article_id' => 'required|exists:'.Article::class.',id',
            'threads' => 'array',
            'threads.*' => [
                'string',
                'exists:'.Thread::class.',id',
                function (string $attribute, mixed $value, Closure $fail) {
                    if (Auth::user()->threads()->where('id', $value)->doesntExist()) {
                        $fail('Unknown thread');
                    }
                },
            ],
        ];
    }
}
