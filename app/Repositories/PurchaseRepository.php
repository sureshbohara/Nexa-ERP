<?php

namespace App\Repositories;

use App\Models\Purchase;

class PurchaseRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new Purchase();
    }

    public function getAll()
    {
        return $this->model
            ->with([
                'supplier:id,name', 
                'warehouse:id,name', 
                'user:id,first_name,last_name',
                'payments:id,purchase_id,amount,payment_method,reference_no,payment_date'
            ])
            ->latest()
            ->get();
    }
}