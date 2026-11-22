<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Customer;
use App\Models\Organization;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SaleSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        $branch = Branch::where('code', 'HO-001')->first();
        $warehouse = Warehouse::where('code', 'WH-KTM-01')->first();
        $customer = Customer::where('code', 'CUS-001')->first();
        $adminUser = User::where('username', 'companyadmin')->first();
        $iphone = Product::where('sku', 'PROD-IPH15-001')->first();

        if (!$organization || !$branch || !$warehouse || !$customer || !$adminUser || !$iphone) {
            $this->command->error('Prerequisite data not found.');
            return;
        }

        DB::transaction(function () use ($organization, $branch, $warehouse, $customer, $adminUser, $iphone) {
            $sale = Sale::create([
                'organization_id' => $organization->id,
                'branch_id' => $branch->id,
                'customer_id' => $customer->id,
                'user_id' => $adminUser->id,
                'warehouse_id' => $warehouse->id,
                'reference_no' => 'SO-2026-0001',
                'sale_date' => now()->subDays(2),
                'subtotal' => 360000.00,
                'tax_amount' => 46800.00,
                'discount_amount' => 0,
                'shipping_charge' => 0,
                'total_amount' => 406800.00,
                'paid_amount' => 406800.00,
                'due_amount' => 0,
                'payment_status' => 'paid',
                'delivery_status' => 'delivered',
                'status' => 'completed',
                'notes' => 'Sale of 2 iPhone 15 Pro',
            ]);

            SaleItem::create([
                'sale_id' => $sale->id,
                'product_id' => $iphone->id,
                'warehouse_id' => $warehouse->id,
                'quantity' => 2,
                'unit_price' => 180000.00,
                'discount' => 0,
                'tax_rate' => 13.00,
                'tax_amount' => 46800.00,
                'total' => 406800.00,
            ]);
        });

        $this->command->info('Sales seeded successfully!');
    }
}