<?php

namespace App\Services;

use App\Models\SalaryStructure;
use App\Repositories\SalaryStructureRepository;

class SalaryStructureService
{
    public function __construct(protected SalaryStructureRepository $repository){}

    /*
    |--------------------------------------------------------------------------
    | Salary Structure Operations
    |--------------------------------------------------------------------------
    */

    public function getAll(){
        return $this->repository->getAll();
    }


    public function create(array $data): SalaryStructure
    {
        return $this->repository->create($data);
    }

    public function update(SalaryStructure $salaryStructure,array $data): SalaryStructure
    {
        return $this->repository->update(
            $salaryStructure,
            $data
        );
    }

    public function delete(SalaryStructure $salaryStructure): bool
     {
        return $this->repository->delete($salaryStructure);
    }
    

    public function updateStatus(SalaryStructure $salaryStructure,string $status): SalaryStructure
     {
        return $this->repository->update(
            $salaryStructure,
            [
                'status' => $status,
            ]
        );
    }
}
