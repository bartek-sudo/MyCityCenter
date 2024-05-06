<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::truncate();
        User::insert(
            [
                [
                    'name' => 'Bilbo Baggins',
                    'email' => 'krolbartek14@gmail.com',
                    'password' => bcrypt('123.321A'),
                    'role_id' => 3,
                    'email_verified_at' => now(),
                ],
                [
                    'name' => 'Jan',
                    'email' => 'jan@email.com',
                    'password' => Hash::make('1234'),
                    'role_id' => 1,
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
