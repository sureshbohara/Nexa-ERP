<?php
namespace App\Repositories;
use App\Models\Employee;

class EmployeeRepository extends BaseRepository
{
    protected function setModel(): void { $this->model = new Employee(); }

    public function getAll() {
        return $this->model->with([
            'user:id,first_name,last_name,email', 
            'department:id,name', 
            'branch:id,name', 
            'salaryStructure:id,name'
        ])->latest()->get();
    }
}