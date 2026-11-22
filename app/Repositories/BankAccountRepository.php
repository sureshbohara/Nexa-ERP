<?php

namespace App\Repositories;

use App\Models\BankAccount;

class BankAccountRepository extends BaseRepository
{
    protected function setModel(): void { $this->model = new BankAccount(); }

    public function getAll()
    {
        return $this->model
            ->with(['account:id,name,code'])
            ->latest()
            ->get();
    }
}