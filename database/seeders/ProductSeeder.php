<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Organization;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        
        $mobileCategory = Category::where('code', 'CAT-MOBILE')->first();
        $riceCategory = Category::where('code', 'CAT-RICE')->first();
        
        $appleBrand = Brand::where('code', 'BRD-APPLE')->first();
        $localBrand = Brand::where('code', 'BRD-LOCAL')->first();
        
        $pieceUnit = Unit::where('code', 'PCS')->first();
        $kgUnit = Unit::where('code', 'KG')->first();

        if (!$organization || !$pieceUnit || !$kgUnit) {
            $this->command->error('Prerequisite data not found.');
            return;
        }

        $products = [
            [
                'category_id' => $mobileCategory?->id,
                'brand_id' => $appleBrand?->id,
                'unit_id' => $pieceUnit->id,
                'name' => 'iPhone 15 Pro',
                'sku' => 'PROD-IPH15-001',
                'barcode' => '8901234567890',
                'description' => 'Latest Apple Smartphone',
                'purchase_price' => 150000.00,
                'selling_price' => 180000.00,
                'tax_rate' => 13.00,
                'low_stock_threshold' => 5,
                'has_variants' => true,
                'has_serial_number' => true,
                'status' => 'active',
            ],
            [
                'category_id' => $riceCategory?->id,
                'brand_id' => $localBrand?->id,
                'unit_id' => $kgUnit->id,
                'name' => 'Basmati Rice Premium',
                'sku' => 'PROD-RICE-001',
                'barcode' => '8901234567891',
                'description' => 'High quality Basmati Rice',
                'purchase_price' => 120.00,
                'selling_price' => 150.00,
                'tax_rate' => 0.00,
                'low_stock_threshold' => 50,
                'has_batch' => true,
                'has_expiry' => true,
                'status' => 'active',
            ],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'sku' => $product['sku'],
                ],
                array_merge($product, ['organization_id' => $organization->id])
            );
        }

        $this->command->info('Products seeded successfully!');
    }
}