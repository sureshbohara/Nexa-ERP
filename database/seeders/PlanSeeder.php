<?php
namespace Database\Seeders;
use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            ['name' => 'Free Trial', 'code' => 'TRIAL', 'price' => 0.00, 'billing_cycle' => 'monthly', 'features' => json_encode(['max_users' => 5, 'modules' => ['inventory']]), 'is_active' => true],
            ['name' => 'Starter ERP', 'code' => 'STARTER', 'price' => 49.99, 'billing_cycle' => 'monthly', 'features' => json_encode(['max_users' => 20, 'modules' => ['inventory', 'sales', 'purchase']]), 'is_active' => true],
            ['name' => 'Enterprise ERP', 'code' => 'ENTERPRISE', 'price' => 199.99, 'billing_cycle' => 'yearly', 'features' => json_encode(['max_users' => -1, 'modules' => ['inventory', 'sales', 'purchase', 'accounting', 'hrm']]), 'is_active' => true],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['code' => $plan['code']], $plan);
        }
        $this->command->info('Plans seeded successfully!');
    }
}