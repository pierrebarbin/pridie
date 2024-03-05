<?php

declare(strict_types=1);

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Article;
use App\Models\Reaction;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        \App\Models\User::factory(1)->create([
            'email' => 'admin@glanum.fr',
        ]);

        //Article::factory(100)->create();

        Reaction::query()->create([
            'image' => '👍',
        ]);

        Reaction::query()->create([
            'image' => '🚀',
        ]);

        Reaction::query()->create([
            'image' => '🎉',
        ]);

        Reaction::query()->create([
            'image' => '❤️',
        ]);

        Reaction::query()->create([
            'image' => '🪨',
        ]);
    }
}
