<?php

namespace App\Repositories;

use App\Models\Attendance;

class AttendanceRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new Attendance();
    }

    public function getAll(){
        return $this->model->with(['employee.user'])->latest('attendance_date')->get();
    }
}