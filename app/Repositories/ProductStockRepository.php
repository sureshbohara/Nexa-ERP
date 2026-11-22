<?php
namespace App\Repositories;
use App\Models\ProductStock;

class ProductStockRepository extends BaseRepository
{
    protected function setModel(): void { $this->model = new ProductStock(); }

    public function getAll(array $filters) {
        $query = $this->model->with(['product:id,name,sku', 'warehouse:id,name']);
        if (!empty($filters['product_id'])) $query->where('product_id', $filters['product_id']);
        if (!empty($filters['warehouse_id'])) $query->where('warehouse_id', $filters['warehouse_id']);
        return $query->latest()->get();
    }
}