<?php

namespace Database\Seeders;

use App\Models\Department;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();

        if (!$organization) {
            $this->command->error('Organization not found.');
            return;
        }


        $adminDept = Department::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => 'DEPT-ADMIN'],
            [
                'organization_id' => $organization->id,
                'parent_id' => null,
                'name' => 'Administration',
                'description' => 'Administrative department',
                'status' => 'active',
            ]
        );

        $salesDept = Department::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => 'DEPT-SALES'],
            [
                'organization_id' => $organization->id,
                'parent_id' => null,
                'name' => 'Sales & Marketing',
                'description' => 'Sales and marketing department',
                'status' => 'active',
            ]
        );

        $itDept = Department::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => 'DEPT-IT'],
            [
                'organization_id' => $organization->id,
                'parent_id' => null,
                'name' => 'Information Technology',
                'description' => 'IT department',
                'status' => 'active',
            ]
        );

        $warehouseDept = Department::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => 'DEPT-WH'],
            [
                'organization_id' => $organization->id,
                'parent_id' => null,
                'name' => 'Warehouse',
                'description' => 'Warehouse operations',
                'status' => 'active',
            ]
        );

     
        Department::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => 'DEPT-ACCT'],
            [
                'organization_id' => $organization->id,
                'parent_id' => $adminDept->id,
                'name' => 'Accounting',
                'description' => 'Accounting and finance',
                'status' => 'active',
            ]
        );

        $this->command->info('Departments seeded successfully!');
    }
}