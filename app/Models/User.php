<?php

declare(strict_types=1);

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function config(): HasOne
    {
        return $this->hasOne(Config::class, 'user_id', 'id');
    }

    public function oneTimeCode(): HasOne
    {
        return $this->hasOne(OneTimeCode::class, 'email', 'email');
    }

    public function bookmarks(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'bookmark', 'user_id', 'article_id');
    }

    public function threads(): HasMany
    {
        return $this->hasMany(Thread::class, 'user_id', 'id');
    }

    public function defaultTags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'user_default_tags', 'user_id', 'tag_id');
    }
}
