<?php

namespace Database\Seeders;

use App\Models\Organization;
use App\Models\SalaryStructure;
use Illuminate\Database\Seeder;

class SalaryStructureSeeder extends Seeder
{
    public function run(): void
    {
        $organization = Organization::where('code', 'ORG-001')->first();

        if (!$organization) {
            $this->command->error('Organization not found.');
            return;
        }

        $structures = [
            [
                'name' => 'Entry Level',
                'code' => 'SAL-ENTRY',
                'basic_salary' => 25000.00,
                'house_rent_allowance' => 5000.00,
                'transport_allowance' => 2000.00,
                'medical_allowance' => 1500.00,
                'other_allowance' => 0.00,
                'provident_fund' => 2500.00,
                'tax_deduction' => 1000.00,
                'other_deduction' => 0.00,
                'status' => 'active',
            ],
            [
                'name' => 'Mid Level',
                'code' => 'SAL-MID',
                'basic_salary' => 50000.00,
                'house_rent_allowance' => 10000.00,
                'transport_allowance' => 4000.00,
                'medical_allowance' => 3000.00,
                'other_allowance' => 2000.00,
                'provident_fund' => 5000.00,
                'tax_deduction' => 5000.00,
                'other_deduction' => 0.00,
                'status' => 'active',
            ],
            [
                'name' => 'Senior Level',
                'code' => 'SAL-SENIOR',
                'basic_salary' => 100000.00,
                'house_rent_allowance' => 20000.00,
                'transport_allowance' => 8000.00,
                'medical_allowance' => 5000.00,
                'other_allowance' => 5000.00,
                'provident_fund' => 10000.00,
                'tax_deduction' => 15000.00,
                'other_deduction' => 0.00,
                'status' => 'active',
            ],
        ];

        foreach ($structures as $structure) {
            SalaryStructure::updateOrCreate(
                [
                    'organization_id' => $organization->id,
                    'code' => $structure['code'],
                ],
                array_merge($structure, ['organization_id' => $organization->id])
            );
        }

        $this->command->info('Salary Structures seeded successfully!');
    }
}