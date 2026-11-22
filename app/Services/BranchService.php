<?php

namespace App\Services;

use App\Models\Branch;
use App\Models\Organization;
use App\Repositories\BranchRepository;

class BranchService
{
    public function __construct(protected BranchRepository $repository) {}


    public function getAll(){
        return $this->repository->getAllWithOrganization();
    }

    public function create(array $data): Branch
    {
        return $this->repository->create($data);
    }


    public function update(Branch $branch, array $data): Branch
    {
        return $this->repository->update($branch, $data);
    }


    public function updateStatus(Branch $branch, string $status): Branch
    {
        return $this->repository->update($branch, ['status' => $status]);
    }


    public function delete(Branch $branch): bool
    {
        if ($branch->users()->exists()) {
            return false;
        }
        return $this->repository->delete($branch);
    }


    public function getActiveOrganizations()
    {
        return Organization::where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name']);
    }
    
}