<?php

namespace App\Repositories;

use App\Models\Category;

class CategoryRepository extends BaseRepository
{
    protected function setModel(): void { $this->model = new Category(); }

    public function getAll() {
        return $this->model->with('parent')->latest()->get();
    }
}