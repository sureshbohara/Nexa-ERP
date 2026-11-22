<?php

namespace App\Repositories;

use App\Models\Warehouse;

class WarehouseRepository extends BaseRepository
{
    protected function setModel(): void { $this->model = new Warehouse(); }

    public function getAll() {
        return $this->model->with('branch:id,name')->latest()->get();
    }
}