<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Organization;
use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class WarehouseSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        $headOffice = Branch::where('code', 'HO-001')->first();
        $pokharaBranch = Branch::where('code', 'PKR-001')->first();

        if (!$organization || !$headOffice) {
            $this->command->error('Organization or Head Office not found.');
            return;
        }

        $warehouses = [
            [
                'branch_id' => $headOffice->id,
                'name' => 'Kathmandu Main Warehouse',
                'code' => 'WH-KTM-01',
                'address' => 'Godown Area, Kathmandu',
                'manager_name' => 'Hari Man',
                'phone' => '9800000050',
                'status' => 'active',
            ],
        ];

        if ($pokharaBranch) {
            $warehouses[] = [
                'branch_id' => $pokharaBranch->id,
                'name' => 'Pokhara Branch Store',
                'code' => 'WH-PKR-01',
                'address' => 'Store Room, Pokhara',
                'manager_name' => 'Shyam KC',
                'phone' => '9800000051',
                'status' => 'active',
            ];
        }

        foreach ($warehouses as $warehouse) {
            Warehouse::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'code' => $warehouse['code'],
                ],
                array_merge($warehouse, ['organization_id' => $organization->id])
            );
        }

        $this->command->info('Warehouses seeded successfully!');
    }
}