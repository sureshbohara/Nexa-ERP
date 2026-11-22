<?php

namespace App\Services;

use App\Models\Employee;
use App\Repositories\EmployeeRepository;

class EmployeeService
{
    public function __construct(
        protected EmployeeRepository $repository
    ) {
    }

 

    public function getAll(){
        return $this->repository->getAll();
    }

    public function create(array $data): Employee
    {
        return $this->repository->create($data);
    }

    public function update(
        Employee $employee,
        array $data
    ): Employee {
        return $this->repository->update($employee, $data);
    }

    public function delete(Employee $employee): bool
    {
        return $this->repository->delete($employee);
    }

    public function updateStatus(
        Employee $employee,
        string $status
    ): Employee {
        return $this->repository->update(
            $employee,
            [
                'status' => $status,
            ]
        );
    }
}
