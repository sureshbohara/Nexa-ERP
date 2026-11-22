<?php

namespace App\Repositories;

use App\Models\SalaryStructure;

class SalaryStructureRepository extends BaseRepository
{
    protected function setModel(): void { $this->model = new SalaryStructure(); }

    public function getAll() {
        return $this->model->latest()->get();
    }
}