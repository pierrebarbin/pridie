<?php

namespace App\Models;

use App\Enums\BookmarkType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;

class Article extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function bookmarks(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'bookmark', 'article_id', 'user_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'article_tag', 'article_id', 'tag_id');
    }

    public function scopeByTags(Builder $query, ...$tags): Builder
    {
        return $query->whereHas('tags', function($query) use ($tags) {
            $query->whereIn('id', Arr::wrap($tags));
        });
    }

    public function scopeShowBookmark(Builder $query, $value = 'yes'): Builder
    {
        if ($value === BookmarkType::Yes->value) {
            return $query->with('bookmarks');
        }

        return $query->whereDoesntHave('bookmarks', function($query) {
            $query->where('id', Auth::user()->id);
        });
    }
}
