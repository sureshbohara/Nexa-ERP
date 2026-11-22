<?php

namespace App\Repositories;

use App\Models\Product;

class ProductRepository extends BaseRepository
{
    protected function setModel(): void 
    { 
        $this->model = new Product(); 
    }

    public function getAll() 
    {
        return $this->model
            ->with([
                'category:id,name', 
                'brand:id,name', 
                'unit:id,name',
                'variants' 
            ])
            ->withCount('variants') 
            ->latest()
            ->get();
    }
}