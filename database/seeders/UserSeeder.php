<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Organization;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
     
        $organization = Organization::first();
        $branch = Branch::first();


        if (!$organization || !$branch) {
            $this->command->error(
                'Please seed Organization and Branch first.'
            );

            return;
        }

 
        $users = [
            [
                'first_name' => 'SaaS',
                'last_name' => 'Owner',
                'email' => 'superadmin@saas.com',
                'username' => 'superadmin',
                'phone' => '9800000000',
                'role_name' => 'Super Admin',
                'organization_id' => null,
                'branch_id' => null,
            ],
            [
                'first_name' => 'Company',
                'last_name' => 'Owner',
                'email' => 'admin@company.com',
                'username' => 'companyadmin',
                'phone' => '9800000001',
                'role_name' => 'Admin',
                'organization_id' => $organization->id,
                'branch_id' => $branch->id,
            ],
            [
                'first_name' => 'Ram',
                'last_name' => 'Employee',
                'email' => 'employee@company.com',
                'username' => 'employee',
                'phone' => '9800000002',
                'role_name' => 'Employee',
                'organization_id' => $organization->id,
                'branch_id' => $branch->id,
            ],
        ];

   
        foreach ($users as $userData) {

          
            $role = Role::where('name', $userData['role_name'])
                ->where('guard_name', 'web')
                ->first();

          
            if (!$role) {
                $this->command->warn(
                    "Role {$userData['role_name']} not found. Skipping."
                );

                continue;
            }

          
            User::updateOrCreate(
                [
                    'email' => $userData['email'],
                ],
                [
                    'first_name' => $userData['first_name'],
                    'last_name' => $userData['last_name'],
                    'username' => $userData['username'],
                    'phone' => $userData['phone'],
                    'password' => Hash::make('password123'),
                    'role_id' => $role->id,
                    'organization_id' => $userData['organization_id'],
                    'branch_id' => $userData['branch_id'],
                    'status' => 'active',
                ]
            );
        }

        // Display success message
        $this->command->info(
            'Users seeded successfully! Default Password: password123'
        );
    }
}
