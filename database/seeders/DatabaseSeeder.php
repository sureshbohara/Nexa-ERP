<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            // Phase 1: Core
            PlanSeeder::class,
            OrganizationSeeder::class,
            SubscriptionSeeder::class,
            BranchSeeder::class,
            PermissionSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,

            // Phase 6: Global Config
            PaymentGatewaySeeder::class,
            SettingSeeder::class,

            // Phase 2: Inventory
            UnitSeeder::class,
            CategorySeeder::class,
            BrandSeeder::class,
            WarehouseSeeder::class,
            ProductSeeder::class,
            ProductVariantSeeder::class,
            ProductStockSeeder::class,
            StockMovementSeeder::class,

            // Phase 3: Purchase & Sales
            SupplierSeeder::class,
            CustomerSeeder::class,
            PurchaseSeeder::class,
            SaleSeeder::class,

            // Phase 4: Accounting
            AccountSeeder::class,
            BankAccountSeeder::class,
            ExpenseSeeder::class,

            // Phase 5: HRM
            DepartmentSeeder::class,
            SalaryStructureSeeder::class,
            EmployeeSeeder::class,
            LeaveTypeSeeder::class,
            HolidaySeeder::class,
            AttendanceSeeder::class,
            LeaveApplicationSeeder::class,
            PayrollSeeder::class,

            // Phase 6: Billing & Notifications
            SubscriptionInvoiceSeeder::class,
            NotificationSeeder::class,
        ]);
    }
}