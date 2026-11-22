<?php

namespace App\Repositories;

use App\Models\LeaveType;

class LeaveTypeRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new LeaveType();
    }

    public function getAll()
    {
        return $this->model->latest()->get();
    }
}