<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class ArticleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'bookmarked' => $this->whenLoaded('bookmarks', function () {
                return $this->bookmarks->contains(Auth::user());
            }),
            'created_at' => $this->created_at->diffForHumans()
        ];
    }
}
