<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Branch;
use App\Models\Employee;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
      
        $organization = Organization::where('code', 'ORG-001')->first();

     
        $branch = Branch::where('code', 'HO-001')->first();


        if (!$organization || !$branch) {
            $this->command->error('Organization or Branch not found.');
            return;
        }

   
        $employees = Employee::where(
            'organization_id',
            $organization->id
        )->get();

        if ($employees->isEmpty()) {
            $this->command->error('No employees found.');
            return;
        }


        foreach ($employees as $employee) {

            for ($i = 0; $i < 7; $i++) {

                $date = now()->subDays($i);

             
                if ($date->isSaturday()) {
                    continue;
                }

                Attendance::updateOrCreate(
                    [
                        'employee_id' => $employee->id,
                        'attendance_date' => $date->toDateString(),
                    ],
                    [
                        'organization_id' => $organization->id,
                        'branch_id' => $branch->id,
                        'check_in' => $date->copy()->setTime(9, 0),
                        'check_out' => $date->copy()->setTime(17, 0),
                        'status' => 'present',
                        'working_hours' => 8.00,
                    ]
                );
            }
        }

        $this->command->info(
            'Attendances seeded successfully!'
        );
    }
}
