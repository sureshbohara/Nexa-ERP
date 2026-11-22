<?php

namespace App\Services;

use App\Models\Customer;
use App\Repositories\CustomerRepository;

class CustomerService
{
    public function __construct(protected CustomerRepository $repository) {}

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function create(array $data): Customer
    {
        return $this->repository->create($data);
    }

    public function update(Customer $customer, array $data): Customer
    {
        return $this->repository->update($customer, $data);
    }

    public function delete(Customer $customer): bool
    {
        return $this->repository->delete($customer);
    }

    public function updateStatus(Customer $customer, string $status): Customer
    {
        return $this->repository->update($customer, [
            'status' => $status,
        ]);
    }
}