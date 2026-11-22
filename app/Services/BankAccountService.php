<?php

namespace App\Services;

use App\Models\BankAccount;
use App\Repositories\BankAccountRepository;

class BankAccountService
{
    public function __construct(protected BankAccountRepository $repository) {}

    public function getAll() { return $this->repository->getAll(); }

    public function create(array $data): BankAccount
    {
        return $this->repository->create($data);
    }

    public function update(BankAccount $bankAccount, array $data): BankAccount
    {
        return $this->repository->update($bankAccount, $data);
    }

    public function delete(BankAccount $bankAccount): bool
    {
        return $this->repository->delete($bankAccount);
    }

    public function updateStatus(BankAccount $bankAccount, string $status): BankAccount
    {
        return $this->repository->update($bankAccount, ['status' => $status]);
    }
}