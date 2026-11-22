<?php

namespace App\Repositories;

use App\Models\Sale;

class SaleRepository extends BaseRepository
{
    protected function setModel(): void { $this->model = new Sale(); }

    public function getAll()
    {
        return $this->model
            ->with([
                'customer:id,name', 
                'warehouse:id,name', 
                'user:id,first_name,last_name',
                'payments:id,sale_id,amount,payment_method,reference_no,payment_date' 
            ])
            ->latest()
            ->get();
    }
}