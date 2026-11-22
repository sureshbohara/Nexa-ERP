<?php

namespace App\Repositories;

use App\Models\Unit;

class UnitRepository extends BaseRepository
{
    protected function setModel(): void { $this->model = new Unit(); }

    public function getAll() {
        return $this->model->latest()->get();
    }
}