<?php

namespace App\Services;

use App\Models\LeaveType;
use App\Repositories\LeaveTypeRepository;

class LeaveTypeService
{
    public function __construct(protected LeaveTypeRepository $repository) {}

    public function getAll(){
        return $this->repository->getAll();
    }

    public function create(array $data): LeaveType
    {
        return $this->repository->create($data);
    }

    public function update(LeaveType $leaveType, array $data): LeaveType
    {
        return $this->repository->update($leaveType, $data);
    }

    public function delete(LeaveType $leaveType): bool
    {
        return $this->repository->delete($leaveType);
    }

    public function updateStatus(LeaveType $leaveType, string $status): LeaveType
    {
        return $this->repository->update($leaveType, ['status' => $status]);
    }
}