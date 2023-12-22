<?php

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
            'title' => $this->faker->title,
            'content' => '{"time":1703243469530,"blocks":[{"id":"voYiRUVGb-","type":"paragraph","data":{"text":"This week, the Laravel team released v10.38 with a&nbsp;fromRoute()&nbsp;testing helper, a Blade&nbsp;@session&nbsp;directive, basic&nbsp;whereJsonContains&nbsp;support for SQLite, and more."}},{"id":"dd02Z02m_q","type":"paragraph","data":{"text":"As part of Laravel\'s weekly releases, the team also rolled out&nbsp;<a href=\"https://vitejs.dev/blog/announcing-vite5\">Vite 5</a>&nbsp;support to all first-party Laravel packages. For example, when you run&nbsp;laravel new&nbsp;to create a new Laravel application or you install Breeze, you will be using Vite 5 out of the box!"}}],"version":"2.28.2"}'
        ];
    }
}
