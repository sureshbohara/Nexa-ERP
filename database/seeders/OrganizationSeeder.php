<?php
namespace Database\Seeders;
use App\Models\Organization;
use Illuminate\Database\Seeder;

class OrganizationSeeder extends Seeder
{
    public function run(): void
    {
        Organization::updateOrCreate(
            ['code' => 'ORG-001'],
            [
                'name' => 'Nepal Trading Pvt. Ltd.', 'registration_number' => 'REG-12345', 'pan_vat_number' => '987654321',
                'contact_person' => 'Ram Bahadur', 'phone' => '9800000001', 'alternate_phone' => '9800000002',
                'email' => 'info@nepaltrading.com', 'website' => 'https://nepaltrading.com',
                'province' => 'Bagmati Province', 'district' => 'Kathmandu', 'municipality' => 'Kathmandu Metropolitan City',
                'ward_number' => '10', 'address' => 'New Road, Kathmandu', 'established_date' => '2020-01-01', 'status' => 'active',
            ]
        );
        $this->command->info('Organization seeded successfully!');
    }
}