<?php

namespace App\Services;

use App\Models\Branch;
use App\Models\Warehouse;
use App\Repositories\WarehouseRepository;

class WarehouseService
{
    public function __construct(protected WarehouseRepository $repository) {}


    public function getAll(){
        return $this->repository->getAll();
    }

 
    public function create(array $data): Warehouse
    {
        return $this->repository->create($data);
    }


    public function update(Warehouse $warehouse, array $data): Warehouse
    {
        return $this->repository->update($warehouse, $data);
    }


    public function delete(Warehouse $warehouse): bool
    {
        return $this->repository->delete($warehouse);
    }


    public function updateStatus(Warehouse $warehouse, string $status): Warehouse
    {
        return $this->repository->update($warehouse, [
            'status' => $status,
        ]);
    }


    public function getBranches()
    {
        return Branch::where('status', 'active')
            ->orderBy('name')
            ->get(['id', 'name']);
    }
}
