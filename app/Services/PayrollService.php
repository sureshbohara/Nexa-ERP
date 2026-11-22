<?php

namespace App\Services;

use App\Models\Branch;
use App\Models\Employee;
use App\Models\Payroll;
use App\Models\Payslip;
use App\Repositories\PayrollRepository;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PayrollService
{
    public function __construct(protected PayrollRepository $repository) {}

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function processPayroll(array $data): Payroll
    {
        return DB::transaction(function () use ($data): Payroll {
            $user = Auth::user();
            $branchId = $data['branch_id'] ?? $user?->branch_id;


            if ($branchId !== null) {
                $selectedBranch = Branch::query()->find($branchId);
                $userOrgId = $user?->organization_id;

                $isValidBranch = false;
                if ($userOrgId) {
                    $isValidBranch = (int) $selectedBranch->organization_id === (int) $userOrgId;
                } else {
                    $isValidBranch = in_array((int) $selectedBranch->organization_id, [1, 0]);
                }

                if (!$selectedBranch || !$isValidBranch) {
                    throw ValidationException::withMessages([
                        'branch_id' => 'The selected branch is not available in your organization.',
                    ]);
                }
            }

            $duplicatePayroll = Payroll::query()
                ->where('payroll_period', $data['payroll_period'])
                ->when($branchId !== null, fn ($q) => $q->where('branch_id', $branchId), fn ($q) => $q->whereNull('branch_id'))
                ->exists();

            if ($duplicatePayroll) {
                throw ValidationException::withMessages([
                    'payroll_period' => 'A payroll already exists for this branch and period.',
                ]);
            }

            $payroll = Payroll::create([
                'organization_id'  => $user->organization_id,
                'user_id'          => $user->id,
                'branch_id'        => $branchId,
                'payroll_period'   => $data['payroll_period'],
                'start_date'       => $data['start_date'],
                'end_date'         => $data['end_date'],
                'status'           => 'draft',
                'notes'            => $data['notes'] ?? null,
            ]);

            $effectiveBranchId = $payroll->branch_id;

            $employeeQuery = Employee::query()
                ->where('status', 'active')
                ->whereNotNull('salary_structure_id')
                ->whereHas('salaryStructure', fn ($q) => $q->where('status', 'active'))
                ->with('salaryStructure')
                ->lockForUpdate();

            if ($effectiveBranchId !== null) {
                $employeeQuery->where('branch_id', $effectiveBranchId);
            }

            $employees = $employeeQuery->get();

            if ($employees->isEmpty()) {
                throw ValidationException::withMessages([
                    'payroll' => 'No active employees with an active salary structure were found for this selection.',
                ]);
            }

            $employeeIds = $employees->modelKeys();
            $existingEmployeeIds = array_fill_keys(
                Payslip::query()->where('pay_period', $data['payroll_period'])->whereIn('employee_id', $employeeIds)->pluck('employee_id')->all(),
                true
            );

            $totalBasicCents = 0; 
            $totalAllowancesCents = 0; 
            $totalDeductionsCents = 0; 
            $netPayableCents = 0; 
            $processedCount = 0;

            foreach ($employees as $employee) {
                if (isset($existingEmployeeIds[$employee->id])) continue;
                $salary = $employee->salaryStructure;
                if (!$salary) continue;

                $basicCents = $this->toCents($salary->basic_salary);
                $houseRentCents = $this->toCents($salary->house_rent_allowance);
                $transportCents = $this->toCents($salary->transport_allowance);
                $medicalCents = $this->toCents($salary->medical_allowance);
                $otherAllowanceCents = $this->toCents($salary->other_allowance);
                $providentFundCents = $this->toCents($salary->provident_fund);
                $taxCents = $this->toCents($salary->tax_deduction);
                $otherDeductionCents = $this->toCents($salary->other_deduction);

                $allowancesCents = $houseRentCents + $transportCents + $medicalCents + $otherAllowanceCents;
                $grossCents = $basicCents + $allowancesCents;
                $deductionsCents = $providentFundCents + $taxCents + $otherDeductionCents;
                $netCents = $grossCents - $deductionsCents;

              
                Payslip::create([
                    'organization_id'      => $payroll->organization_id,
                    'payroll_id'           => $payroll->id,
                    'employee_id'          => $employee->id,
                    'salary_structure_id'  => $salary->id,
                    'pay_period'           => $data['payroll_period'],
                    'basic_salary'         => $this->fromCents($basicCents),
                    'house_rent_allowance' => $this->fromCents($houseRentCents),
                    'transport_allowance'  => $this->fromCents($transportCents),
                    'medical_allowance'    => $this->fromCents($medicalCents),
                    'other_allowance'      => $this->fromCents($otherAllowanceCents),
                    'overtime_amount'      => '0.00',
                    'bonus'                => '0.00',
                    'provident_fund'       => $this->fromCents($providentFundCents),
                    'tax_deduction'        => $this->fromCents($taxCents),
                    'other_deduction'      => $this->fromCents($otherDeductionCents),
                    'gross_salary'         => $this->fromCents($grossCents),
                    'total_deductions'     => $this->fromCents($deductionsCents),
                    'net_salary'           => $this->fromCents($netCents),
                    'payment_status'       => 'unpaid',
                ]);

                $totalBasicCents += $basicCents;
                $totalAllowancesCents += $allowancesCents;
                $totalDeductionsCents += $deductionsCents;
                $netPayableCents += $netCents;
                $processedCount++;
            }

            if ($processedCount === 0) {
                throw ValidationException::withMessages([
                    'payroll' => 'Payslips already exist for all eligible employees in this period.',
                ]);
            }

            $payroll->update([
                'total_employees'  => $processedCount,
                'total_basic'      => $this->fromCents($totalBasicCents),
                'total_allowances' => $this->fromCents($totalAllowancesCents),
                'total_deductions' => $this->fromCents($totalDeductionsCents),
                'net_payable'      => $this->fromCents($netPayableCents),
                'status'           => 'processed',
            ]);

            return $payroll->fresh(['user', 'branch'])->loadCount('payslips');
        }, 3);
    }

    public function markPaid(Payroll $payroll): void
    {
        DB::transaction(function () use ($payroll): void {
            $lockedPayroll = Payroll::query()->whereKey($payroll->getKey())->lockForUpdate()->firstOrFail();

            if ($lockedPayroll->status === 'paid') {
                throw ValidationException::withMessages(['payroll' => 'This payroll has already been paid.']);
            }
            if ($lockedPayroll->status !== 'processed') {
                throw ValidationException::withMessages(['payroll' => 'Only a processed payroll can be marked as paid.']);
            }

            $unpaidCount = $lockedPayroll->payslips()->where('payment_status', 'unpaid')->count();
            if ($unpaidCount === 0) {
                throw ValidationException::withMessages(['payroll' => 'This payroll has no unpaid payslips to settle.']);
            }

            $lockedPayroll->payslips()->where('payment_status', 'unpaid')->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
            ]);

            $lockedPayroll->update(['status' => 'paid']);
        }, 3);
    }

    private function toCents(mixed $amount): int
    {
        return (int) round(((float) ($amount ?? 0)) * 100);
    }

    private function fromCents(int $amount): string
    {
        return number_format($amount / 100, 2, '.', '');
    }
}