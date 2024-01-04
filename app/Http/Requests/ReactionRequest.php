<?php

namespace App\Http\Requests;

use App\Models\Reaction;
use Illuminate\Foundation\Http\FormRequest;

class ReactionRequest extends FormRequest
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
            'reactions' => 'array',
            'reactions.*' => 'string|exists:'.Reaction::class.',id'
        ];
    }
}
