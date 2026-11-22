<?php

namespace App\Repositories;

use App\Models\Supplier;

class SupplierRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new Supplier();
    }

    public function getAll()
    {
        return $this->model->latest()->get();
    }
}