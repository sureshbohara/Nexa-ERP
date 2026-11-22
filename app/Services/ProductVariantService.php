<?php

namespace App\Services;

use App\Models\ProductVariant;
use App\Repositories\ProductVariantRepository;
use Illuminate\Database\Eloquent\Collection;

class ProductVariantService
{
    public function __construct(protected ProductVariantRepository $repository) {}

  
    public function getByProduct(?int $productId): Collection|array
    {
        return $productId ? $this->repository->getByProduct($productId) : [];
    }

    
    public function create(array $data): ProductVariant
    {
        return $this->repository->create($data);
    }

  
    public function update(ProductVariant $variant, array $data): ProductVariant
    {
        return $this->repository->update($variant, $data);
    }


    public function delete(ProductVariant $variant): bool
    {
        return $this->repository->delete($variant);
    }
}
