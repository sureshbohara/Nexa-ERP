<?php

namespace App\Services;

use App\Models\Unit;
use App\Repositories\UnitRepository;

class UnitService
{
    public function __construct(protected UnitRepository $repository) {}

  
    public function getAll()
    {
        return $this->repository->getAll();
    }

    
    public function create(array $data): Unit
    {
        return $this->repository->create($data);
    }


    public function update(Unit $unit, array $data): Unit
    {
        return $this->repository->update($unit, $data);
    }


    public function delete(Unit $unit): bool
    {
        return $this->repository->delete($unit);
    }


    public function updateStatus(Unit $unit, string $status): Unit
    {
        return $this->repository->update($unit, [
            'status' => $status,
        ]);
    }
}
