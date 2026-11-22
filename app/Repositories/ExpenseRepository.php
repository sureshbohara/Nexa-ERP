<?php

namespace App\Repositories;

use App\Models\Expense;

class ExpenseRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new Expense();
    }

    public function getAll()
    {
        return $this->model
            ->with(['account:id,name,code', 'user:id,name', 'branch:id,name'])
            ->latest('expense_date')
            ->get();
    }
}