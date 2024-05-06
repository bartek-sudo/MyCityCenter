<?php

namespace Database\Seeders;

use App\Models\Proposal;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            DepartmentSeeder::class,
            UserSeeder::class,
        ]);

        // User::factory()->create([
        //     'name' => 'Bilbo Baggins',
        //     'email' => 'krolbartek14@gmail.com',
        //     'password' => bcrypt('123.321A'),
        //     'role_id' => 3,
        //     'email_verified_at' => now(),
        // ]);

        // Department::factory()->create([
        //     'name' => 'HR', 'description' => 'Human Resources Department'
        // ]);

        Proposal::factory()
            ->count(30)
            ->hasReplies(5)
            ->create();
    }
}
