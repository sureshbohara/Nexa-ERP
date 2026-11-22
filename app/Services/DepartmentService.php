<?php
namespace App\Services;
use App\Models\Department;
use App\Repositories\DepartmentRepository;

class DepartmentService
{
    public function __construct(protected DepartmentRepository $repository) {}


    public function getAll(){
      return $this->repository->getAll();
    }


    public function create(array $data): Department 
    {
      return $this->repository->create($data); 
    }


    public function update(Department $department, array $data): Department 
    { 
        return $this->repository->update($department, $data);
     }


    public function delete(Department $department): bool 
    { 
     return $this->repository->delete($department);
     }


    public function updateStatus(Department $department, string $status): Department {
        return $this->repository->update($department, ['status' => $status]);
    }

}