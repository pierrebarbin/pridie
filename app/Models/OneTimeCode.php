<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Notifications\Notifiable;

class OneTimeCode extends Model
{
    use HasFactory, HasUuids, Notifiable;

    protected $guarded = [];
    protected $casts = [
        'expire_at' => 'datetime'
    ];

    public function account(): HasOne
    {
        return $this->hasOne(User::class, 'email', 'email');
    }

    public function scopeActive(Builder $builder): void
    {
        $builder->where('expire_at', '>', now());
    }
}
