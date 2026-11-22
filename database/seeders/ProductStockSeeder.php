<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Product;
use App\Models\ProductStock;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ProductStockSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        $warehouse = Warehouse::where('code', 'WH-KTM-01')->first();
        
        $iphone = Product::where('sku', 'PROD-IPH15-001')->first();
        $rice = Product::where('sku', 'PROD-RICE-001')->first();

        if (!$organization || !$warehouse || !$iphone || !$rice) {
            return;
        }

        $stocks = [
            [
                'product_id' => $iphone->id,
                'warehouse_id' => $warehouse->id,
                'quantity' => 15,
                'batch_number' => null,
                'expiry_date' => null,
            ],
            [
                'product_id' => $rice->id,
                'warehouse_id' => $warehouse->id,
                'quantity' => 500,
                'batch_number' => 'BATCH-2023-10',
                'expiry_date' => Carbon::now()->addMonths(12)->format('Y-m-d'),
            ],
        ];

        foreach ($stocks as $stock) {
            ProductStock::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'product_id' => $stock['product_id'],
                    'warehouse_id' => $stock['warehouse_id'],
                    'batch_number' => $stock['batch_number'],
                ],
                array_merge($stock, ['organization_id' => $organization->id])
            );
        }

        $this->command->info('Product Stocks seeded successfully!');
    }
}