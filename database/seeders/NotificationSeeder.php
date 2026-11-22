<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();
        $adminUser = User::withoutGlobalScopes()->where('username', 'companyadmin')->first();

        Notification::updateOrCreate(
            [
                'organization_id' => null,
                'title' => 'System Maintenance Notice',
            ],
            [
                'notifiable_type' => null,
                'notifiable_id' => null,
                'type' => 'system',
                'message' => 'System will be under maintenance on Saturday 2 AM - 4 AM.',
                'priority' => 'high',
                'data' => ['url' => null],
            ]
        );

        if ($organization) {
            Notification::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'title' => 'Subscription Activated',
                ],
                [
                    'notifiable_type' => null,
                    'notifiable_id' => null,
                    'type' => 'subscription',
                    'message' => 'Your Enterprise ERP plan is now active.',
                    'priority' => 'normal',
                    'data' => ['plan' => 'ENTERPRISE'],
                ]
            );
        }

        if ($adminUser) {
            Notification::updateOrCreate(
                [
                    'organization_id' => $organization?->id,
                    'notifiable_type' => User::class,
                    'notifiable_id' => $adminUser->id,
                    'title' => 'Low Stock Alert',
                ],
                [
                    'type' => 'inventory',
                    'message' => 'Basmati Rice Premium is running low on stock.',
                    'priority' => 'high',
                    'data' => ['sku' => 'PROD-RICE-001'],
                ]
            );
        }

        $this->command->info('Notifications seeded successfully!');
    }
}