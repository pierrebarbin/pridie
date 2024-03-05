<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ArticleReaction extends Pivot
{
    use HasFactory;

    protected $table = 'article_reaction';
}
