<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class ProductVariantSeeder extends Seeder
{
    public function run(): void
    {
        $iphone = Product::where('sku', 'PROD-IPH15-001')->first();

        if (!$iphone) {
            return;
        }

        $variants = [
            [
                'product_id' => $iphone->id,
                'name' => 'Storage',
                'value' => '128GB Black',
                'sku' => 'VAR-IPH15-128-BLK',
                'additional_price' => 0.00,
                'stock_quantity' => 10,
            ],
            [
                'product_id' => $iphone->id,
                'name' => 'Storage',
                'value' => '256GB White',
                'sku' => 'VAR-IPH15-256-WHT',
                'additional_price' => 15000.00,
                'stock_quantity' => 5,
            ],
        ];

        foreach ($variants as $variant) {
            ProductVariant::updateOrCreate(
                [
                    'product_id' => $variant['product_id'],
                    'sku' => $variant['sku'],
                ],
                $variant
            );
        }

        $this->command->info('Product Variants seeded successfully!');
    }
}