<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Schema;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Schema::withoutForeignKeyConstraints(function () {
            Department::truncate();
        });

        Department::insert(
            [
                [
                'name' => 'Transport',
                'description' => 'Vehicles and transportation department',
                ],
                [
                    'name' => 'Architecture',
                    'description' => 'Architecture and design department',
                ],
                [
                    'name' => 'HR',
                    'description' => 'Human Resources Department',
                ],
                [
                    'name' => 'IT',
                    'description' => 'Information Technology Department',
                ],
                [
                    'name' => 'Finance',
                    'description' => 'Finance and accounting department',
                ],
                [
                    'name' => 'Marketing',
                    'description' => 'Marketing and sales department',
                ],
                [
                    'name' => 'Legal',
                    'description' => 'Legal department',
                ],
                [
                    'name' => 'Customer Service',
                    'description' => 'Customer service department',
                ],
                [
                    'name' => 'Research and Development',
                    'description' => 'Research and development department',
                ],
                [
                    'name' => 'Production',
                    'description' => 'Production department',
                ],
                [
                    'name' => 'Quality Assurance',
                    'description' => 'Quality assurance department',
                ],
                [
                    'name' => 'Purchasing',
                    'description' => 'Purchasing department',
                ],
                [
                    'name' => 'Logistics',
                    'description' => 'Logistics department',
                ],
                [
                    'name' => 'Maintenance',
                    'description' => 'Maintenance department',
                ],
                [
                    'name' => 'Security',
                    'description' => 'Security department',
                ],
                [
                    'name' => 'Training',
                    'description' => 'Training department',
                ],
                [
                    'name' => 'Health and Safety',
                    'description' => 'Health and safety department',
                ],
                [
                    'name' => 'Administration',
                    'description' => 'Administration department',
                ],
                [
                    'name' => 'Public Relations',
                    'description' => 'Public relations department',
                ],
                [
                    'name' => 'Warehouse',
                    'description' => 'Warehouse department',
                ],
            ]
        );
    }

}
