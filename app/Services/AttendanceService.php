<?php

namespace App\Services;

use App\Models\Attendance;
use App\Repositories\AttendanceRepository;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttendanceService
{
    public function __construct(protected AttendanceRepository $repository) {}

    public function getAll(){
        return $this->repository->getAll();
    }

    public function create(array $data): Attendance
    {
        return DB::transaction(function () use ($data) {
            if (!empty($data['check_in']) && !empty($data['check_out'])) {
                $inTime = Carbon::parse($data['check_in']);
                $outTime = Carbon::parse($data['check_out']);
                $minutes = $inTime->diffInMinutes($outTime);
                $data['working_hours'] = round($minutes / 60, 2);
            } else {
                $data['working_hours'] = 0;
            }

            return $this->repository->create($data);
        });
    }

    public function update(Attendance $attendance, array $data): Attendance
    {
        return DB::transaction(function () use ($attendance, $data) {
            $checkIn = $data['check_in'] ?? $attendance->check_in;
            $checkOut = $data['check_out'] ?? $attendance->check_out;

            if (!empty($checkIn) && !empty($checkOut)) {
                $inTime = Carbon::parse($checkIn);
                $outTime = Carbon::parse($checkOut);
                
                $minutes = $inTime->diffInMinutes($outTime);
                $data['working_hours'] = round($minutes / 60, 2);
            } else {
                $data['working_hours'] = 0;
            }

            return $this->repository->update($attendance, $data);
        });
    }
    

    public function delete(Attendance $attendance): bool
    {
        return $this->repository->delete($attendance);
    }
}