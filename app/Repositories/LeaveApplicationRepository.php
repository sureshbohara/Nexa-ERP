<?php

namespace App\Repositories;

use App\Models\LeaveApplication;

class LeaveApplicationRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new LeaveApplication();
    }

    public function getAll()
    {
        return $this->model->with(['employee.user', 'leaveType', 'approvedBy'])->latest('start_date')->get();
    }
}