<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Organization;
use App\Models\Payroll;
use App\Models\Payslip;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PayrollSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        $branch = Branch::where('code', 'HO-001')->first();
        $adminUser = User::where('username', 'companyadmin')->first();
        $employees = Employee::where('organization_id', $organization->id)
            ->with('salaryStructure')
            ->get();

        if (!$organization || !$branch || !$adminUser || $employees->isEmpty()) {
            $this->command->error('Prerequisite data not found.');
            return;
        }

        DB::transaction(function () use ($organization, $branch, $adminUser, $employees) {
            $payPeriod = now()->format('Y-m');
            $startDate = now()->startOfMonth();
            $endDate = now()->endOfMonth();

            $totalBasic = 0;
            $totalAllowances = 0;
            $totalDeductions = 0;
            $netPayable = 0;

            $payroll = Payroll::create([
                'organization_id' => $organization->id,
                'branch_id' => $branch->id,
                'user_id' => $adminUser->id,
                'payroll_period' => $payPeriod,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'total_employees' => $employees->count(),
                'status' => 'paid',
            ]);

            foreach ($employees as $employee) {
                $structure = $employee->salaryStructure;
                
                if (!$structure) {
                    continue;
                }

                $grossSalary = $structure->gross_salary;
                $totalDeduction = $structure->total_deduction;
                $netSalary = $structure->net_salary;

                Payslip::create([
                    'organization_id' => $organization->id,
                    'payroll_id' => $payroll->id,
                    'employee_id' => $employee->id,
                    'salary_structure_id' => $structure->id,
                    'pay_period' => $payPeriod,
                    'basic_salary' => $structure->basic_salary,
                    'house_rent_allowance' => $structure->house_rent_allowance,
                    'transport_allowance' => $structure->transport_allowance,
                    'medical_allowance' => $structure->medical_allowance,
                    'other_allowance' => $structure->other_allowance,
                    'overtime_amount' => 0,
                    'bonus' => 0,
                    'provident_fund' => $structure->provident_fund,
                    'tax_deduction' => $structure->tax_deduction,
                    'other_deduction' => $structure->other_deduction,
                    'gross_salary' => $grossSalary,
                    'total_deductions' => $totalDeduction,
                    'net_salary' => $netSalary,
                    'payment_status' => 'paid',
                    'paid_at' => now(),
                ]);

                $totalBasic += $structure->basic_salary;
                $totalAllowances += $structure->total_allowance;
                $totalDeductions += $totalDeduction;
                $netPayable += $netSalary;
            }

            $payroll->update([
                'total_basic' => $totalBasic,
                'total_allowances' => $totalAllowances,
                'total_deductions' => $totalDeductions,
                'net_payable' => $netPayable,
            ]);
        });

        $this->command->info('Payroll seeded successfully!');
    }
}