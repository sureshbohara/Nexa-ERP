<?php

namespace App\Repositories;

use App\Models\PurchaseReturn;

class PurchaseReturnRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new PurchaseReturn();
    }

    public function getAll()
    {
        return $this->model
            ->with([
                'supplier:id,name', 
                'warehouse:id,name', 
                'user:id,first_name,last_name',
                'purchase:id,reference_no'
            ])
            ->latest()
            ->get();
    }
}