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
            'image_paths' => "[\"proposal\\\/wjTlS3MXviTrTqwr\\\/cIq7yzcTMGi5xtoC1gBtNYGipMIkhPbutU2erdhc.webp\",\"proposal\\\/wjTlS3MXviTrTqwr\\\/MoxQ9oT7IkQ5yqZoeK4L3Cxxxk6njgjlmkvPAZIs.webp\",\"proposal\\\/wjTlS3MXviTrTqwr\\\/CYVUX9rC7VS2rxaSoGJ84kDY15Sh9zzewmQrAjjn.webp\",\"proposal\\\/wjTlS3MXviTrTqwr\\\/tcrUvA4Cayawf1h6tge5RnHPGR4NxzCJ093GRyu1.webp\",\"proposal\\\/wjTlS3MXviTrTqwr\\\/EICDK5DC0pdeks2xZVIEQY7cxYZkl32jBRBm0Wbp.webp\",\"proposal\\\/wjTlS3MXviTrTqwr\\\/gjD1sOC5scn8XhR9sQGjg1gnVzr3bW12vezbQYeW.webp\",\"proposal\\\/wjTlS3MXviTrTqwr\\\/WcZjQLRpD5eLeVHQzWww3DtWyug4I56OP6e5Zxmi.webp\",\"proposal\\\/wjTlS3MXviTrTqwr\\\/5tgcM9GlQvqziMmX1qrXc9lkxulDgD5Ym3Q9lcAp.webp\"]",
            'created_by' => $this->faker->numberBetween(4, 6),
            'processed_by' => $this->faker->numberBetween(2, 3),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
