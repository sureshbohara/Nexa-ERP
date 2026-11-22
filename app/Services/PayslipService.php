<?php

namespace App\Services;

use App\Repositories\PayslipRepository;

class PayslipService
{
    public function __construct(protected PayslipRepository $repository){}

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function getById(int $id)
    {
        return $this->repository->getById($id);
    }

    public function getByEmployee(int $employeeId)
    {
        return $this->repository->getByEmployee($employeeId);
    }
}
