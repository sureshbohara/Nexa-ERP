<?php

namespace App\Services;

use App\Models\Account;
use App\Repositories\AccountRepository;

class AccountService
{
    public function __construct(protected AccountRepository $repository) {}

    public function getAll()
    {
        return $this->repository->getAll();
    }

    public function getActiveAccounts()
    {
        return $this->repository->getActiveAccounts();
    }

    public function create(array $data): Account
    {
        return $this->repository->create($data);
    }

    public function update(Account $account, array $data): Account
    {
        return $this->repository->update($account, $data);
    }

    public function delete(Account $account): bool
    {
        if ($account->is_system) {
            throw new \Exception('System accounts cannot be deleted.');
        }
        return $this->repository->delete($account);
    }

    public function updateStatus(Account $account, string $status): Account
    {
        if ($account->is_system) {
            throw new \Exception('System account status cannot be changed.');
        }
        return $this->repository->update($account, ['status' => $status]);
    }
}