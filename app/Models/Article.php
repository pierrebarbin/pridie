<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\BookmarkType;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;

class Article extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function threads(): BelongsToMany
    {
        return $this->belongsToMany(Thread::class, 'bookmarks', 'article_id', 'thread_id');
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'article_tag', 'article_id', 'tag_id');
    }

    public function reactions(): BelongsToMany
    {
        return $this->belongsToMany(Reaction::class, 'article_reaction', 'article_id', 'reaction_id');
    }

    public function articleReactions(): HasMany
    {
        return $this->hasMany(ArticleReaction::class, 'article_id', 'id');
    }

    public function userReactions(): HasMany
    {
        return $this->hasMany(ArticleReaction::class, 'article_id', 'id')
            ->where('user_id', Auth::user()->id);
    }

    public function userThreads(): BelongsToMany
    {
        return $this->belongsToMany(Thread::class, 'bookmarks', 'article_id', 'thread_id')
            ->where('user_id', Auth::user()->id);
    }

    public function scopeByTags(Builder $query, ...$tags): Builder
    {
        return $query->whereHas('tags', function ($query) use ($tags) {
            $query->whereIn('id', Arr::wrap($tags));
        });
    }

    public function scopeShowBookmark(Builder $query, $value = 'yes'): Builder
    {
        if ($value === BookmarkType::Yes->value) {
            return $query->with('threads');
        }

        return $query->whereDoesntHave('threads', function ($query) {
            $query->where('user_id', Auth::user()->id);
        });
    }

    public function scopeByThread(Builder $query, $value): Builder
    {
        return $query->whereHas('threads', function ($query) use ($value) {
            $query->where('id', $value);
        });
    }
}
