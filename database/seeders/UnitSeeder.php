<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Unit;
use Illuminate\Database\Seeder;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();

        if (!$organization) {
            $this->command->error('Organization not found.');
            return;
        }

        $units = [
            [
                'name' => 'Piece',
                'code' => 'PCS',
                'description' => 'Standard single unit',
                'status' => 'active',
            ],
            [
                'name' => 'Kilogram',
                'code' => 'KG',
                'description' => 'Weight measurement',
                'status' => 'active',
            ],
            [
                'name' => 'Box',
                'code' => 'BOX',
                'description' => 'Packaged container',
                'status' => 'active',
            ],
            [
                'name' => 'Liter',
                'code' => 'LTR',
                'description' => 'Volume measurement',
                'status' => 'active',
            ],
        ];

        foreach ($units as $unit) {
            Unit::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'code' => $unit['code'],
                ],
                array_merge($unit, ['organization_id' => $organization->id])
            );
        }

        $this->command->info('Units seeded successfully!');
    }
}