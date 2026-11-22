<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ProductStock;
use App\Models\StockMovement;
use App\Models\Warehouse;
use App\Repositories\ProductStockRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProductStockService
{
    public function __construct(protected ProductStockRepository $repository) {}

    public function getAll(array $filters) {
        return $this->repository->getAll($filters);
    }

    public function getProducts() {
        return Product::where('status', 'active')
            ->get(['id', 'name', 'sku', 'has_variants', 'has_serial_number', 'has_batch', 'has_expiry']);
    }

    public function getWarehouses() {
        return Warehouse::where('status', 'active')->get(['id', 'name']);
    }

    public function adjustStock(array $data, $user) {
        return DB::transaction(function () use ($data, $user) {
            $warehouse = Warehouse::findOrFail($data['warehouse_id']);
            
            $organizationId = $warehouse->organization_id 
                ?? $user->organization_id 
                ?? \App\Models\Organization::value('id');
            
            $branchId = $warehouse->branch_id ?? $user->branch_id;

            $stock = ProductStock::query()
                ->where('product_id', $data['product_id'])
                ->where('warehouse_id', $data['warehouse_id'])
                ->where('batch_number', $data['batch_number'] ?? null)
                ->lockForUpdate()
                ->first();

            if (!$stock) {
                $stock = ProductStock::create([
                    'organization_id' => $organizationId,
                    'branch_id' => $branchId,
                    'product_id' => $data['product_id'],
                    'warehouse_id' => $data['warehouse_id'],
                    'batch_number' => $data['batch_number'] ?? null,
                    'expiry_date' => $data['expiry_date'] ?? null,
                    'quantity' => 0,
                ]);
            }

            $oldQty = (int) $stock->quantity;

            switch ($data['type']) {
                case 'stock_in':
                    $newQty = $oldQty + (int) $data['quantity'];
                    break;
                case 'stock_out':
                    if ((int) $data['quantity'] > $oldQty) {
                        throw ValidationException::withMessages([
                            'quantity' => 'Insufficient stock available.'
                        ]);
                    }
                    $newQty = $oldQty - (int) $data['quantity'];
                    break;
                case 'adjustment':
                    $newQty = (int) $data['quantity'];
                    break;
                default:
                    throw ValidationException::withMessages([
                        'type' => 'Invalid stock adjustment type.'
                    ]);
            }

            $stock->update([
                'quantity' => $newQty,
                'expiry_date' => $data['expiry_date'] ?? $stock->expiry_date,
            ]);

            StockMovement::create([
                'organization_id' => $organizationId,
                'branch_id' => $branchId,
                'product_id' => $data['product_id'],
                'warehouse_id' => $data['warehouse_id'],
                'user_id' => $user->id,
                'type' => $data['type'],
                'quantity' => $data['quantity'],
                'batch_number' => $data['batch_number'] ?? null,
                'notes' => $data['notes'] ?? 'Manual adjustment',
                'reference_type' => 'manual',
            ]);

            return $stock;
        });
    }



    public function transferStock(array $data, $user) {
        return DB::transaction(function () use ($data, $user) {
            $sourceWarehouse = Warehouse::findOrFail($data['source_warehouse_id']);
            $destWarehouse = Warehouse::findOrFail($data['destination_warehouse_id']);

            $organizationId = $sourceWarehouse->organization_id 
                ?? $user->organization_id 
                ?? \App\Models\Organization::value('id');

            $quantity = (int) $data['quantity'];
            $referenceId = (string) Str::uuid(); 

      
            $sourceStock = ProductStock::query()
                ->where('product_id', $data['product_id'])
                ->where('warehouse_id', $data['source_warehouse_id'])
                ->lockForUpdate()
                ->first();

            if (!$sourceStock || $sourceStock->quantity < $quantity) {
                throw ValidationException::withMessages([
                    'quantity' => 'Insufficient stock at source warehouse. Available: ' 
                        . ($sourceStock->quantity ?? 0),
                ]);
            }

            $sourceStock->update(['quantity' => $sourceStock->quantity - $quantity]);

            StockMovement::create([
                'organization_id' => $organizationId,
                'branch_id' => $sourceWarehouse->branch_id ?? $user->branch_id,
                'product_id' => $data['product_id'],
                'warehouse_id' => $data['source_warehouse_id'],
                'user_id' => $user->id,
                'type' => 'transfer',
                'quantity' => $quantity,
                'batch_number' => null,
                'notes' => $data['notes'] 
                    ? "Transfer OUT to {$destWarehouse->name}: {$data['notes']}" 
                    : "Transfer OUT to {$destWarehouse->name}",
                'reference_type' => 'transfer',
                'reference_id' => $referenceId,
            ]);

  
            $destStock = ProductStock::query()
                ->where('product_id', $data['product_id'])
                ->where('warehouse_id', $data['destination_warehouse_id'])
                ->lockForUpdate()
                ->first();

            if (!$destStock) {
                $destStock = ProductStock::create([
                    'organization_id' => $destWarehouse->organization_id ?? $organizationId,
                    'branch_id' => $destWarehouse->branch_id ?? $user->branch_id,
                    'product_id' => $data['product_id'],
                    'warehouse_id' => $data['destination_warehouse_id'],
                    'quantity' => 0,
                ]);
            }

            $destStock->update(['quantity' => $destStock->quantity + $quantity]);

            StockMovement::create([
                'organization_id' => $destWarehouse->organization_id ?? $organizationId,
                'branch_id' => $destWarehouse->branch_id ?? $user->branch_id,
                'product_id' => $data['product_id'],
                'warehouse_id' => $data['destination_warehouse_id'],
                'user_id' => $user->id,
                'type' => 'transfer',
                'quantity' => $quantity,
                'batch_number' => null,
                'notes' => $data['notes'] 
                    ? "Transfer IN from {$sourceWarehouse->name}: {$data['notes']}" 
                    : "Transfer IN from {$sourceWarehouse->name}",
                'reference_type' => 'transfer',
                'reference_id' => $referenceId,
            ]);

            return true;
        });
    }
}