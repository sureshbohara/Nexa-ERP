<?php
namespace Database\Seeders;
use App\Models\Branch;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        if (!$organization) { $this->command->error('Organization not found.'); return; }

        $branches = [
            ['name' => 'Head Office', 'code' => 'HO-001', 'branch_type' => 'head_office', 'manager_name' => 'Ram Bahadur', 'phone' => '9800000001', 'province' => 'Bagmati Province', 'district' => 'Kathmandu', 'municipality' => 'Kathmandu', 'ward_number' => '10', 'address' => 'New Road, Kathmandu', 'status' => 'active'],
            ['name' => 'Pokhara Branch', 'code' => 'PKR-001', 'branch_type' => 'branch', 'manager_name' => 'Shyam KC', 'phone' => '9800000003', 'province' => 'Gandaki Province', 'district' => 'Kaski', 'municipality' => 'Pokhara', 'ward_number' => '5', 'address' => 'Lakeside, Pokhara', 'status' => 'active'],
        ];

        foreach ($branches as $branch) {
            Branch::updateOrCreate(
                ['organization_id' => $organization->id, 'code' => $branch['code']],
                array_merge($branch, ['organization_id' => $organization->id])
            );
        }
        $this->command->info('Branches seeded successfully!');
    }
}