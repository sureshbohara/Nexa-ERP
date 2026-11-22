<?php

namespace Database\Seeders;

use App\Models\Holiday;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class HolidaySeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();

        if (!$organization) {
            $this->command->error('Organization not found.');
            return;
        }

        $holidays = [
            [
                'name' => 'Dashain',
                'date' => '2026-10-15',
                'description' => 'Major Hindu festival',
                'is_recurring' => true,
                'status' => 'active',
            ],
            [
                'name' => 'Tihar',
                'date' => '2026-11-05',
                'description' => 'Festival of lights',
                'is_recurring' => true,
                'status' => 'active',
            ],
            [
                'name' => 'Constitution Day',
                'date' => '2026-09-19',
                'description' => 'National Constitution Day',
                'is_recurring' => true,
                'status' => 'active',
            ],
            [
                'name' => 'New Year 2027',
                'date' => '2027-01-01',
                'description' => 'International New Year',
                'is_recurring' => true,
                'status' => 'active',
            ],
        ];

        foreach ($holidays as $holiday) {
            Holiday::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'name' => $holiday['name'],
                    'date' => $holiday['date'],
                ],
                array_merge($holiday, ['organization_id' => $organization->id])
            );
        }

        $this->command->info('Holidays seeded successfully!');
    }
}