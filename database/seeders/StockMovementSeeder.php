<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Product;
use App\Models\StockMovement;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class StockMovementSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        $warehouse = Warehouse::where('code', 'WH-KTM-01')->first();
        $adminUser = User::where('username', 'companyadmin')->first();
        
        $iphone = Product::where('sku', 'PROD-IPH15-001')->first();
        $rice = Product::where('sku', 'PROD-RICE-001')->first();

        if (!$organization || !$warehouse || !$adminUser || !$iphone || !$rice) {
            return;
        }

        $movements = [
            [
                'product_id' => $iphone->id,
                'warehouse_id' => $warehouse->id,
                'user_id' => $adminUser->id,
                'type' => 'stock_in',
                'quantity' => 15,
                'reference_type' => 'initial_stock',
                'reference_id' => null,
                'notes' => 'Initial stock entry for iPhone 15',
            ],
            [
                'product_id' => $rice->id,
                'warehouse_id' => $warehouse->id,
                'user_id' => $adminUser->id,
                'type' => 'stock_in',
                'quantity' => 500,
                'reference_type' => 'initial_stock',
                'reference_id' => null,
                'batch_number' => 'BATCH-2023-10',
                'notes' => 'Initial stock entry for Basmati Rice',
            ],
        ];

        foreach ($movements as $movement) {
            StockMovement::create(
                array_merge($movement, [
                    'organization_id' => $organization->id,
                    'branch_id' => $warehouse->branch_id,
                ])
            );
        }

        $this->command->info('Stock Movements seeded successfully!');
    }
}