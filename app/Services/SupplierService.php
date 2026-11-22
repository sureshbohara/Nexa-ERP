<?php

namespace App\Services;

use App\Models\Supplier;
use App\Repositories\SupplierRepository;

class SupplierService
{
    public function __construct(protected SupplierRepository $repository) {}

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function create(array $data): Supplier
    {
        return $this->repository->create($data);
    }

    public function update(Supplier $supplier, array $data): Supplier
    {
        return $this->repository->update($supplier, $data);
    }

    public function delete(Supplier $supplier): bool
    {
        return $this->repository->delete($supplier);
    }

    public function updateStatus(Supplier $supplier, string $status): Supplier
    {
        return $this->repository->update($supplier, [
            'status' => $status,
        ]);
    }
}