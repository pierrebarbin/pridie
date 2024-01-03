<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class ArticleReaction extends Pivot
{
    use HasFactory;

    protected $table = 'article_reaction';
}
