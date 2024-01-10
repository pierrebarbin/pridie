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
            'threads' => ThreadResource::collection($this->whenLoaded('userThreads')),
            'reactions' => $this->whenLoaded('articleReactions', function () {
                return $this->articleReactions
                    ->groupBy('reaction_id')
                    ->map(fn ($group, $key) => [
                        'id' => $key,
                        'count' => $group->count()
                    ])->values();
            }),
            'user_reactions' => $this->whenLoaded('userReactions', function () {
                return $this->userReactions
                    ->groupBy('reaction_id')
                    ->map(fn ($group, $key) => [
                        'id' => $key
                    ])->values();
            }),
            'created_at' => $this->created_at->diffForHumans()
        ];
    }
}
