<?php

namespace App\Repositories;

use App\Models\SaleReturn;

class SaleReturnRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new SaleReturn();
    }

    public function getAll()
    {
        return $this->model
            ->with([
                'customer:id,name', 
                'sale:id,reference_no', 
                'user:id,first_name,last_name'
            ])
            ->latest()
            ->get();
    }
}