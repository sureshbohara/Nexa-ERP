<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();

        if (!$organization) {
            $this->command->error('Organization not found.');
            return;
        }

        $brands = [
            [
                'name' => 'Apple',
                'code' => 'BRD-APPLE',
                'description' => 'Apple Inc. products',
                'status' => 'active',
            ],
            [
                'name' => 'Samsung',
                'code' => 'BRD-SAMSUNG',
                'description' => 'Samsung Electronics',
                'status' => 'active',
            ],
            [
                'name' => 'Local Farm',
                'code' => 'BRD-LOCAL',
                'description' => 'Local agricultural products',
                'status' => 'active',
            ],
        ];

        foreach ($brands as $brand) {
            Brand::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'code' => $brand['code'],
                ],
                array_merge($brand, ['organization_id' => $organization->id])
            );
        }

        $this->command->info('Brands seeded successfully!');
    }
}