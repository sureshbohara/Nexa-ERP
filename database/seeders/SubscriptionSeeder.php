<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Plan;
use App\Models\Subscription;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        $plan = Plan::where('code', 'ENTERPRISE')->first();

        if (!$organization || !$plan) {
            $this->command->error('Organization or Plan not found.');
            return;
        }

        Subscription::withoutGlobalScopes()->updateOrCreate(
            [
                'organization_id' => $organization->id,
                'plan_id' => $plan->id,
            ],
            [
                'start_date' => now()->startOfMonth()->toDateString(),
                'end_date' => now()->addYear()->toDateString(),
                'status' => 'active',
            ]
        );

        $this->command->info('Subscription seeded successfully!');
    }
}