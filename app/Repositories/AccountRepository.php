<?php

namespace App\Repositories;

use App\Models\Account;

class AccountRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new Account();
    }

    public function getAll()
    {
        return $this->model
            ->with(['parent:id,name,code'])
            ->latest()
            ->get();
    }

    public function getActiveAccounts()
    {
        return $this->model
            ->where('status', 'active')
            ->get(['id', 'name', 'code', 'type']);
    }
}