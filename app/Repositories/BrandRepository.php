<?php

namespace App\Repositories;

use App\Models\Brand;

class BrandRepository extends BaseRepository
{
    protected function setModel(): void
    {
        $this->model = new Brand();
    }

    public function getAll()
    {
        return $this->model
            ->latest()
            ->get();
    }
}
