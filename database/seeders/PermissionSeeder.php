<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        $modules = [
            // Phase 1
            'dashboard', 'users', 'roles', 'permissions',
            'organizations', 'branches', 'plans', 'subscriptions', 'settings',
            
            // Phase 2
            'categories', 'brands', 'units', 'warehouses', 'products', 'stock',
            
            // Phase 3
            'suppliers', 'customers', 'purchases', 'sales', 'quotations',
            
            // Phase 4
            'accounts', 'bank_accounts', 'journal_entries', 'expenses', 'accounting_reports',
            
            // Phase 5
            'departments', 'employees', 'attendances', 'leave_types',
            'leave_applications', 'holidays', 'salary_structures', 'payrolls', 'payslips',
            
            // Phase 6
            'payment_gateways', 'subscription_invoices', 'subscription_payments',
            'notifications', 'audit_logs', 'attachments', 'reports',
        ];

        $actions = ['view', 'create', 'edit', 'delete', 'export'];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                Permission::updateOrCreate(
                    [
                        'name' => $action . '_' . $module,
                        'guard_name' => 'web',
                    ],
                    [
                        'module' => $module,
                    ]
                );
            }
        }

        $totalPermissions = Permission::where('guard_name', 'web')->count();
        $this->command->info("Permissions seeded successfully! Total: {$totalPermissions}");
    }
}