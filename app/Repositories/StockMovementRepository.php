<?php

namespace App\Repositories;

use App\Models\StockMovement;

class StockMovementRepository extends BaseRepository
{
    protected function setModel(): void 
    { 
        $this->model = new StockMovement(); 
    }

    public function getAll(array $filters) 
    {
        $query = $this->model->with([
            'product:id,name,sku', 
            'warehouse:id,name', 
            'user:id,first_name,last_name'
        ]);

        if (!empty($filters['product_id'])) {
            $query->where('product_id', $filters['product_id']);
        }

        if (!empty($filters['type']) && method_exists($query, $filters['type'])) {
            $query->{$filters['type']}(); 
        }

        return $query->latest()->paginate(20); 
    }
}