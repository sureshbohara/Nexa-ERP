<?php
namespace App\Repositories;
use App\Models\Department;

class DepartmentRepository extends BaseRepository
{
    protected function setModel(): void { $this->model = new Department(); }

    public function getAll() {
        return $this->model->with(['head:id,first_name,last_name', 'parent'])->latest()->get();
    }
}