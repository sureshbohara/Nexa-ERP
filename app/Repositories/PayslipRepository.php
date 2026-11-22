<?php

namespace App\Repositories;

use App\Models\Payslip;

class PayslipRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new Payslip();
    }

    public function getAll()
    {
        return $this->getModel()
            ->with([
                'employee.user:id,first_name,last_name',
                'payroll:id,payroll_period,status',
                'salaryStructure:id,name',
            ])
            ->latest('pay_period')
            ->get();
    }

    public function getById(int $id): Payslip
    {
        return $this->getModel()
            ->with([
                'employee.user:id,first_name,last_name',
                'payroll',
                'salaryStructure',
                'organization',
            ])
            ->findOrFail($id);
    }

    public function getByEmployee(int $employeeId)
    {
        return $this->getModel()
            ->with([
                'payroll:id,payroll_period,status',
                'salaryStructure:id,name',
            ])
            ->where('employee_id', $employeeId)
            ->latest('pay_period')
            ->get();
    }
}