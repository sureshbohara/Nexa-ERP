<?php
namespace App\Repositories;
use App\Models\ProductVariant;

class ProductVariantRepository extends BaseRepository
{
    protected function setModel(): void { $this->model = new ProductVariant(); }
    public function getByProduct(?int $productId) {
        return $this->model->where('product_id', $productId)->latest()->get();
    }
}