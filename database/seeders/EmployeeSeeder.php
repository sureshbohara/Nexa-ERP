<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Department;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\SalaryStructure;
use App\Models\User;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        $branch = Branch::where('code', 'HO-001')->first();
        
        $adminDept = Department::where('code', 'DEPT-ADMIN')->first();
        $itDept = Department::where('code', 'DEPT-IT')->first();
        $warehouseDept = Department::where('code', 'DEPT-WH')->first();
        
        $entrySalary = SalaryStructure::where('code', 'SAL-ENTRY')->first();
        $midSalary = SalaryStructure::where('code', 'SAL-MID')->first();
        $seniorSalary = SalaryStructure::where('code', 'SAL-SENIOR')->first();
        
        $adminUser = User::where('username', 'companyadmin')->first();
        $employeeUser = User::where('username', 'employee')->first();

        if (!$organization || !$branch) {
            $this->command->error('Organization or Branch not found.');
            return;
        }


        if ($adminUser) {
            Employee::updateOrCreate(
                ['user_id' => $adminUser->id],
                [
                    'organization_id' => $organization->id,
                    'branch_id' => $branch->id,
                    'user_id' => $adminUser->id,
                    'department_id' => $adminDept?->id,
                    'salary_structure_id' => $seniorSalary?->id,
                    'employee_code' => 'EMP-001',
                    'designation' => 'Company Administrator',
                    'date_of_joining' => now()->subYears(3),
                    'date_of_birth' => '1985-05-15',
                    'blood_group' => 'B+',
                    'marital_status' => 'married',
                    'nationality' => 'Nepali',
                    'permanent_address' => 'Kathmandu, Nepal',
                    'status' => 'active',
                ]
            );
        }


        if ($employeeUser) {
            Employee::updateOrCreate(
                ['user_id' => $employeeUser->id],
                [
                    'organization_id' => $organization->id,
                    'branch_id' => $branch->id,
                    'user_id' => $employeeUser->id,
                    'department_id' => $warehouseDept?->id,
                    'salary_structure_id' => $entrySalary?->id,
                    'employee_code' => 'EMP-002',
                    'designation' => 'Warehouse Staff',
                    'date_of_joining' => now()->subYear(),
                    'date_of_birth' => '1995-08-20',
                    'blood_group' => 'O+',
                    'marital_status' => 'single',
                    'nationality' => 'Nepali',
                    'permanent_address' => 'Pokhara, Nepal',
                    'status' => 'active',
                ]
            );
        }

        $this->command->info('Employees seeded successfully!');
    }
}