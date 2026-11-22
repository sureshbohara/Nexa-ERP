<?php

namespace App\Services;

use App\Models\Product;
use App\Repositories\StockMovementRepository;

class StockMovementService
{
    public function __construct(protected StockMovementRepository $repository) {}

    public function getAll(array $filters) 
    { 
        return $this->repository->getAll($filters); 
    }
    
    public function getProducts() 
    { 
        return Product::where('status', 'active')->get(['id', 'name', 'sku']); 
    }
}