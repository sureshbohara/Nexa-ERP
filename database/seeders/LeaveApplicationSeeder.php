<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\LeaveApplication;
use App\Models\LeaveType;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;

class LeaveApplicationSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        $branch = Branch::where('code', 'HO-001')->first();
        $employee = Employee::where('employee_code', 'EMP-002')->first();
        $sickLeave = LeaveType::where('code', 'SL')->first();
        $adminUser = User::where('username', 'companyadmin')->first();
        $employeeUser = User::where('username', 'employee')->first();

        if (!$organization || !$branch || !$employee || !$sickLeave) {
            $this->command->error('Prerequisite data not found.');
            return;
        }

        LeaveApplication::updateOrCreate(
            [
                'employee_id' => $employee->id,
                'start_date' => now()->subDays(10)->toDateString(),
            ],
            [
                'organization_id' => $organization->id,
                'branch_id' => $branch->id,
                'employee_id' => $employee->id,
                'leave_type_id' => $sickLeave->id,
                'applied_by' => $employeeUser?->id,
                'approved_by' => $adminUser?->id,
                'start_date' => now()->subDays(10),
                'end_date' => now()->subDays(8),
                'total_days' => 3,
                'reason' => 'Not feeling well, fever and cold',
                'status' => 'approved',
            ]
        );

        $this->command->info('Leave Applications seeded successfully!');
    }
}