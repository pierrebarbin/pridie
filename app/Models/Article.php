<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Article extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function bookmarks(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'bookmark', 'article_id', 'user_id');
    }
}
