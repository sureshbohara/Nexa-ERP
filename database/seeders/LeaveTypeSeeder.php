<?php

namespace Database\Seeders;

use App\Models\LeaveType;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();

        if (!$organization) {
            $this->command->error('Organization not found.');
            return;
        }

        $leaveTypes = [
            [
                'name' => 'Casual Leave',
                'code' => 'CL',
                'days_allowed' => 10,
                'is_paid' => true,
                'is_carried_forward' => false,
                'description' => 'Short personal leave',
                'status' => 'active',
            ],
            [
                'name' => 'Sick Leave',
                'code' => 'SL',
                'days_allowed' => 15,
                'is_paid' => true,
                'is_carried_forward' => true,
                'description' => 'Medical leave',
                'status' => 'active',
            ],
            [
                'name' => 'Earned Leave',
                'code' => 'EL',
                'days_allowed' => 20,
                'is_paid' => true,
                'is_carried_forward' => true,
                'description' => 'Annual earned leave',
                'status' => 'active',
            ],
            [
                'name' => 'Maternity Leave',
                'code' => 'ML',
                'days_allowed' => 60,
                'is_paid' => true,
                'is_carried_forward' => false,
                'description' => 'Maternity leave for female employees',
                'status' => 'active',
            ],
            [
                'name' => 'Unpaid Leave',
                'code' => 'UL',
                'days_allowed' => 30,
                'is_paid' => false,
                'is_carried_forward' => false,
                'description' => 'Leave without pay',
                'status' => 'active',
            ],
        ];

        foreach ($leaveTypes as $leaveType) {
            LeaveType::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'code' => $leaveType['code'],
                ],
                array_merge($leaveType, ['organization_id' => $organization->id])
            );
        }

        $this->command->info('Leave Types seeded successfully!');
    }
}