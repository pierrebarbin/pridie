<?php

declare(strict_types=1);

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Article>
 */
class ArticleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => implode(' ', $this->faker->words),
            'content' => '
Arma terga et iunctis tutam repetita sustinui vultus nec virgine umbras humus
rapida, lacusque. Nemus Liber **te rogat Procne** irascentemque alvo bellique
currum cervice mens rictus tellus **primis**! Me fecit quamvis veteres
fluctusque *Thebis*, dum incepti quae.
',
        ];
    }
}
