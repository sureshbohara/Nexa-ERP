<?php

namespace App\Repositories;

use App\Models\Payroll;

class PayrollRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new Payroll();
    }

    public function getAll()
    {
        return $this->getModel()
            ->with(['user:id,first_name,last_name', 'branch:id,name'])
            ->withCount('payslips')
            ->latest('payroll_period')
            ->get();
    }

    public function getById(int $id): Payroll
    {
        return $this->getModel()
            ->with([
                'user:id,first_name,last_name',
                'branch:id,name',
                'payslips.employee.user:id,first_name,last_name',
                'payslips.branch:id,name',
                'payslips.salaryStructure:id,name',
            ])
            ->findOrFail($id);
    }
}