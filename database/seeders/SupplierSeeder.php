<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class SupplierSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();

        if (!$organization) {
            $this->command->error('Organization not found.');
            return;
        }

        $suppliers = [
            [
                'name' => 'Himalayan Electronics Pvt. Ltd.',
                'code' => 'SUP-001',
                'contact_person' => 'Rajesh Shrestha',
                'phone' => '9841000001',
                'email' => 'rajesh@himalayanelectronics.com',
                'company_name' => 'Himalayan Electronics',
                'tax_number' => '601234567',
                'province' => 'Bagmati Province',
                'district' => 'Kathmandu',
                'address' => 'Putalisadak, Kathmandu',
                'opening_balance' => 0,
                'status' => 'active',
            ],
            [
                'name' => 'Kathmandu Rice Mills',
                'code' => 'SUP-002',
                'contact_person' => 'Sita Devi',
                'phone' => '9841000002',
                'email' => 'sita@ktmrice.com',
                'company_name' => 'Kathmandu Rice Mills',
                'tax_number' => '601234568',
                'province' => 'Bagmati Province',
                'district' => 'Kathmandu',
                'address' => 'Balkhu, Kathmandu',
                'opening_balance' => 5000,
                'status' => 'active',
            ],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'code' => $supplier['code'],
                ],
                array_merge($supplier, ['organization_id' => $organization->id])
            );
        }

        $this->command->info('Suppliers seeded successfully!');
    }
}