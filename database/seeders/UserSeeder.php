<?php

namespace Database\Seeders;

use App\Models\Proposal;
use App\Models\Reply;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::withoutForeignKeyConstraints(function () {
            User::truncate();
        });

        // User::truncate();
        User::insert(
            [
                [
                    'name' => 'Admin',
                    'email' => 'admin@gmail.com',
                    'password' => bcrypt('123.321A'),
                    'role_id' => 3,
                    'email_verified_at' => now(),
                ],
                [
                    'name' => 'Siu Hun', 'email' => 'siuhun@email.com', 'password' => Hash::make('1234'),
                    'role_id' => 2, 'email_verified_at' => now(),
                ],
                [
                    'name' => 'Marta', 'email' => 'marta@email.com', 'password' => Hash::make('1234'),
                    'role_id' => 2, 'email_verified_at' => now(),
                ],
                [
                    'name' => 'Jan',
                    'email' => 'jan@email.com',
                    'password' => Hash::make('1234'),
                    'role_id' => 1,
                    'email_verified_at' => now(),
                ],
                [
                    'name' => 'Bill', 'email' => 'bill@email.com', 'password' => Hash::make('1234'),
                    'role_id' => 1, 'email_verified_at' => now(),
                ],
                [
                    'name' => 'Lilly', 'email' => 'lilly@email.com', 'password' => Hash::make('1234'),
                    'role_id' => 1, 'email_verified_at' => now(),
                ]
            ]
        );
    }
}
