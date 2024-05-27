<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Proposal>
 */
class ProposalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->realText,
            'department_id' => 1,
            'status' => $this->faker->randomElement(['pending', 'in_progress', 'approved', 'rejected']),
            'image_paths' => json_encode([$this->faker->imageUrl()]),
            'created_by' => $this->faker->numberBetween(4, 6),
            'processed_by' => $this->faker->numberBetween(2, 3),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
