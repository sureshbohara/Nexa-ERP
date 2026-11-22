<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();

        $globalSettings = [
            [
                'group' => 'general',
                'key' => 'app_name',
                'value' => 'ERP SaaS',
                'type' => 'string',
            ],
            [
                'group' => 'general',
                'key' => 'default_currency',
                'value' => 'NPR',
                'type' => 'string',
            ],
            [
                'group' => 'general',
                'key' => 'timezone',
                'value' => 'Asia/Kathmandu',
                'type' => 'string',
            ],
            [
                'group' => 'subscription',
                'key' => 'trial_days',
                'value' => 14,
                'type' => 'integer',
            ],
            [
                'group' => 'subscription',
                'key' => 'grace_days',
                'value' => 3,
                'type' => 'integer',
            ],
        ];

        foreach ($globalSettings as $setting) {
            Setting::updateOrCreate(
                [
                    'organization_id' => null,
                    'key' => $setting['key'],
                ],
                $setting
            );
        }

        if ($organization) {
            $companySettings = [
                [
                    'group' => 'general',
                    'key' => 'financial_year_start',
                    'value' => '07-16',
                    'type' => 'string',
                ],
                [
                    'group' => 'inventory',
                    'key' => 'enable_low_stock_alert',
                    'value' => true,
                    'type' => 'boolean',
                ],
                [
                    'group' => 'hrm',
                    'key' => 'office_start_time',
                    'value' => '09:00',
                    'type' => 'string',
                ],
                [
                    'group' => 'hrm',
                    'key' => 'office_end_time',
                    'value' => '17:00',
                    'type' => 'string',
                ],
            ];

            foreach ($companySettings as $setting) {
                Setting::updateOrCreate(
                    [
                        'organization_id' => $organization->id,
                        'key' => $setting['key'],
                    ],
                    array_merge($setting, ['organization_id' => $organization->id])
                );
            }
        }

        $this->command->info('Settings seeded successfully!');
    }
}