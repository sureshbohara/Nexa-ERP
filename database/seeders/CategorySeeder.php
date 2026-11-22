<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();

        if (!$organization) {
            $this->command->error('Organization not found.');
            return;
        }

        // Parent Categories
        $electronics = Category::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => 'CAT-ELEC'],
            [
                'organization_id' => $organization->id,
                'parent_id' => null,
                'name' => 'Electronics',
                'description' => 'Electronic devices and gadgets',
                'status' => 'active',
            ]
        );

        $groceries = Category::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => 'CAT-GROC'],
            [
                'organization_id' => $organization->id,
                'parent_id' => null,
                'name' => 'Groceries',
                'description' => 'Daily food and household items',
                'status' => 'active',
            ]
        );

        // Child Categories
        Category::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => 'CAT-MOBILE'],
            [
                'organization_id' => $organization->id,
                'parent_id' => $electronics->id,
                'name' => 'Mobile Phones',
                'description' => 'Smartphones and accessories',
                'status' => 'active',
            ]
        );

        Category::updateOrCreate(
            ['organization_id' => $organization->id, 'code' => 'CAT-RICE'],
            [
                'organization_id' => $organization->id,
                'parent_id' => $groceries->id,
                'name' => 'Rice & Grains',
                'description' => 'Various types of rice',
                'status' => 'active',
            ]
        );

        $this->command->info('Categories seeded successfully!');
    }
}