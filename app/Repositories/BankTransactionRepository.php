<?php

namespace App\Repositories;

use App\Models\BankTransaction;

class BankTransactionRepository extends BaseRepository
{
    protected function setModel(): void { $this->model = new BankTransaction(); }

    public function getAll()
    {
        return $this->model
            ->with(['bankAccount:id,name,bank_name,account_number'])
            ->latest('transaction_date')
            ->get();
    }
}