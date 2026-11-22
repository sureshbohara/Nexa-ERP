<?php

namespace App\Services;

use App\Models\Holiday;
use App\Repositories\HolidayRepository;

class HolidayService
{
    public function __construct(protected HolidayRepository $repository){}

    public function getAll(){
        return $this->repository->getAll();
    }

    public function create(array $data): Holiday
    {
        return $this->repository->create($data);
    }

    public function update(Holiday $holiday, array $data): Holiday
    {
        return $this->repository->update($holiday, $data);
    }

    public function delete(Holiday $holiday): bool
    {
        return $this->repository->delete($holiday);
    }

    public function updateStatus(Holiday $holiday, string $status): Holiday
    {
        return $this->repository->update($holiday, [
            'status' => $status,
        ]);
    }
}
