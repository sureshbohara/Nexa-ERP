<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Organization;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Supplier;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PurchaseSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        $branch = Branch::where('code', 'HO-001')->first();
        $warehouse = Warehouse::where('code', 'WH-KTM-01')->first();
        $supplier = Supplier::where('code', 'SUP-001')->first();
        $adminUser = User::where('username', 'companyadmin')->first();
        $iphone = Product::where('sku', 'PROD-IPH15-001')->first();

        if (!$organization || !$branch || !$warehouse || !$supplier || !$adminUser || !$iphone) {
            $this->command->error('Prerequisite data not found.');
            return;
        }

        DB::transaction(function () use ($organization, $branch, $warehouse, $supplier, $adminUser, $iphone) {
            $purchase = Purchase::create([
                'organization_id' => $organization->id,
                'branch_id' => $branch->id,
                'supplier_id' => $supplier->id,
                'user_id' => $adminUser->id,
                'warehouse_id' => $warehouse->id,
                'reference_no' => 'PO-2026-0001',
                'purchase_date' => now()->subDays(5),
                'subtotal' => 1500000.00,
                'tax_amount' => 195000.00,
                'discount_amount' => 0,
                'shipping_charge' => 0,
                'total_amount' => 1695000.00,
                'paid_amount' => 1000000.00,
                'due_amount' => 695000.00,
                'payment_status' => 'partial',
                'status' => 'completed',
                'notes' => 'Initial purchase of iPhone 15 Pro',
            ]);

            PurchaseItem::create([
                'purchase_id' => $purchase->id,
                'product_id' => $iphone->id,
                'warehouse_id' => $warehouse->id,
                'quantity' => 10,
                'unit_price' => 150000.00,
                'discount' => 0,
                'tax_rate' => 13.00,
                'tax_amount' => 195000.00,
                'total' => 1695000.00,
            ]);
        });

        $this->command->info('Purchases seeded successfully!');
    }
}