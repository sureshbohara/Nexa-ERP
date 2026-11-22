<?php

namespace App\Services;

use App\Models\LeaveApplication;
use App\Repositories\LeaveApplicationRepository;
use Illuminate\Support\Facades\DB;

class LeaveApplicationService
{
    public function __construct(protected LeaveApplicationRepository $repository) {}

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function create(array $data): LeaveApplication
    {
        return DB::transaction(function () use ($data) {
            $data['applied_by'] = auth()->id();
        
            $start = new \DateTime($data['start_date']);
            $end = new \DateTime($data['end_date']);
            $data['total_days'] = $end->diff($start)->days + 1;

            return $this->repository->create($data);
        });
    }

    public function update(LeaveApplication $application, array $data): LeaveApplication
    {
        return DB::transaction(function () use ($application, $data) {
            if (isset($data['start_date']) && isset($data['end_date'])) {
                $start = new \DateTime($data['start_date']);
                $end = new \DateTime($data['end_date']);
                $data['total_days'] = $end->diff($start)->days + 1;
            }
            return $this->repository->update($application, $data);
        });
    }

    public function delete(LeaveApplication $application): bool
    {
        return $this->repository->delete($application);
    }

    public function approve(LeaveApplication $application): LeaveApplication
    {
        return $this->repository->update($application, [
            'status' => 'approved',
            'approved_by' => auth()->id(),
        ]);
    }

    public function reject(LeaveApplication $application, string $reason): LeaveApplication
    {
        return $this->repository->update($application, [
            'status' => 'rejected',
            'rejection_reason' => $reason,
            'approved_by' => auth()->id(),
        ]);
    }
}