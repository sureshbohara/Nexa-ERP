<?php

use Illuminate\Support\Facades\Route;


use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\OrganizationController;
use App\Http\Controllers\Admin\BranchController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\SubscriptionController;


use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\WarehouseController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductVariantController;
use App\Http\Controllers\Admin\ProductStockController;
use App\Http\Controllers\Admin\StockMovementController;


use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\PurchaseController;
use App\Http\Controllers\Admin\PurchaseReturnController;
use App\Http\Controllers\Admin\SaleController;
use App\Http\Controllers\Admin\SaleReturnController;



use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\BankAccountController;
use App\Http\Controllers\Admin\JournalEntryController;
use App\Http\Controllers\Admin\ExpenseController;
use App\Http\Controllers\Admin\BankTransactionController;




use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\AttendanceController;
use App\Http\Controllers\Admin\LeaveTypeController;
use App\Http\Controllers\Admin\LeaveApplicationController;
use App\Http\Controllers\Admin\HolidayController;
use App\Http\Controllers\Admin\SalaryStructureController;
use App\Http\Controllers\Admin\PayrollController;
use App\Http\Controllers\Admin\PayslipController;



use App\Http\Controllers\Admin\PaymentGatewayController;
use App\Http\Controllers\Admin\SubscriptionInvoiceController;
use App\Http\Controllers\Admin\SubscriptionPaymentController;
use App\Http\Controllers\Admin\NotificationController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\AttachmentController;
use App\Http\Controllers\Admin\RevenueReportController;


// Common Controllers
use App\Http\Controllers\Admin\GlobalSearchController;

/*
|--------------------------------------------------------------------------
| Guest Routes
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    // Global Search
    Route::get('/global-search', [GlobalSearchController::class, 'search'])->name('global-search');

    // Dashboard & Auth
    Route::get('/', fn () => redirect()->route('dashboard'));
    Route::get('/dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Profile Management
    Route::get('/profile', [ProfileController::class, 'editProfile'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'updateProfile'])->name('profile.update');
    Route::get('/profile/password', [ProfileController::class, 'showChangePassword'])->name('profile.password');
    Route::put('/profile/password', [ProfileController::class, 'changePassword'])->name('profile.password.update');

    // System Settings
    Route::prefix('settings')->name('settings.')->group(function () {
        Route::get('/', [SettingController::class, 'index'])->name('index');
        Route::post('/', [SettingController::class, 'update'])->name('update');
    });

    // Users & Roles Management
    Route::resource('users', UserController::class);
    Route::post('/users/{user}/status', [UserController::class, 'updateStatus'])->name('users.status');
    Route::resource('roles', RoleController::class);

    // Organizations & Branches Management
    Route::resource('organizations', OrganizationController::class);
    Route::post('/organizations/{organization}/status', [OrganizationController::class, 'updateStatus'])->name('organizations.status');

    Route::resource('branches', BranchController::class);
    Route::post('/branches/{branch}/status', [BranchController::class, 'updateStatus'])->name('branches.status');

    // Plans & Subscriptions Management
    Route::resource('plans', PlanController::class);
    Route::post('/plans/{plan}/status', [PlanController::class, 'updateStatus'])->name('plans.status');

    Route::resource('subscriptions', SubscriptionController::class);
    Route::post('/subscriptions/{subscription}/status', [SubscriptionController::class, 'updateStatus'])->name('subscriptions.status');


    /*
    |--------------------------------------------------------------------------
    |  Inventory Management Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('inventory')->name('inventory.')->group(function () {
        
        // Categories
        Route::resource('categories', CategoryController::class);
        Route::post('/categories/{category}/status', [CategoryController::class, 'updateStatus'])->name('categories.status');

        // Brands
        Route::resource('brands', BrandController::class);
        Route::post('/brands/{brand}/status', [BrandController::class, 'updateStatus'])->name('brands.status');

        // Units
        Route::resource('units', UnitController::class);
        Route::post('/units/{unit}/status', [UnitController::class, 'updateStatus'])->name('units.status');

        // Warehouses
        Route::resource('warehouses', WarehouseController::class);
        Route::post('/warehouses/{warehouse}/status', [WarehouseController::class, 'updateStatus'])->name('warehouses.status');

        // Products
        Route::resource('products', ProductController::class);
        Route::post('/products/{product}/status', [ProductController::class, 'updateStatus'])->name('products.status');

        // Product Variants
        Route::resource('product-variants', ProductVariantController::class);

        // Product Stocks (Warehouse-wise)
        Route::resource('stocks', ProductStockController::class);
        Route::post('/stocks/adjust', [ProductStockController::class,'adjust'])->name('stocks.adjust');
        Route::post('/stocks/transfer', [ProductStockController::class, 'transfer'])->name('stocks.transfer'); 

        // Stock Movements (History / Logs)
        Route::get('/stock-movements', [StockMovementController::class, 'index'])->name('stock-movements.index');
        Route::get('/stock-movements/{stockMovement}', [StockMovementController::class, 'show'])->name('stock-movements.show');
        
    });


    /*
    |--------------------------------------------------------------------------
    | Phase 3: Purchase & Sales Management Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('transactions')->name('transactions.')->group(function () {
        
        // Suppliers
        Route::resource('suppliers', SupplierController::class);
        Route::post('/suppliers/{supplier}/status', [SupplierController::class, 'updateStatus'])->name('suppliers.status');

        // Customers
        Route::resource('customers', CustomerController::class);
        Route::post('/customers/{customer}/status', [CustomerController::class, 'updateStatus'])->name('customers.status');

        // Purchases
        Route::resource('purchases', PurchaseController::class);
        Route::post('/purchases/{purchase}/status', [PurchaseController::class, 'updateStatus'])->name('purchases.status');
        Route::post('/purchases/{purchase}/payment', [PurchaseController::class, 'addPayment'])->name('purchases.payment');

        // Purchase Returns
        Route::resource('purchase-returns', PurchaseReturnController::class);
        Route::post('/purchase-returns/{purchaseReturn}/status', [PurchaseReturnController::class, 'updateStatus'])->name('purchase-returns.status');

        // Sales
        Route::resource('sales', SaleController::class);
        Route::post('/sales/{sale}/status', [SaleController::class, 'updateStatus'])->name('sales.status');
        Route::post('/sales/{sale}/payment', [SaleController::class, 'addPayment'])->name('sales.payment');
       Route::patch('/sales/{sale}/update-field', [SaleController::class, 'updateField'])->name('sales.update-field');

        // Sale Returns
        Route::resource('sale-returns', SaleReturnController::class);
        Route::post('/sale-returns/{saleReturn}/status', [SaleReturnController::class, 'updateStatus'])->name('sale-returns.status');
    });



    /*
    |--------------------------------------------------------------------------
    | Phase 4: Accounting Management Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('accounting')->name('accounting.')->group(function () {
        
        // Chart of Accounts
        Route::resource('accounts', AccountController::class);
        Route::post('/accounts/{account}/status', [AccountController::class, 'updateStatus'])->name('accounts.status');

        // Bank Accounts
        Route::resource('bank-accounts', BankAccountController::class);
        Route::post('/bank-accounts/{bankAccount}/status', [BankAccountController::class, 'updateStatus'])->name('bank-accounts.status');

        // Journal Entries
        Route::resource('journal-entries', JournalEntryController::class);
        Route::post('/journal-entries/{journalEntry}/post', [JournalEntryController::class, 'post'])->name('journal-entries.post');
        Route::post('/journal-entries/{journalEntry}/cancel', [JournalEntryController::class, 'cancel'])->name('journal-entries.cancel');

        // Expenses
        Route::resource('expenses', ExpenseController::class);
        Route::post('/expenses/{expense}/approve', [ExpenseController::class, 'approve'])->name('expenses.approve');
        Route::post('/expenses/{expense}/reject', [ExpenseController::class, 'reject'])->name('expenses.reject');

        // Bank Transactions 
        Route::get('/bank-transactions', [BankTransactionController::class, 'index'])->name('bank-transactions.index');
        Route::get('/bank-transactions/create', [BankTransactionController::class, 'create'])->name('bank-transactions.create');
        Route::post('/bank-transactions', [BankTransactionController::class, 'store'])->name('bank-transactions.store');
        Route::put('/bank-transactions/{bankTransaction}', [BankTransactionController::class, 'update'])->name('bank-transactions.update');
        Route::get('/bank-transactions/{bankTransaction}', [BankTransactionController::class, 'show'])->name('bank-transactions.show');
        Route::post('/bank-transactions/{bankTransaction}/reconcile', [BankTransactionController::class, 'reconcile'])->name('bank-transactions.reconcile');

        // Financial Reports
        Route::get('/reports/trial-balance', [JournalEntryController::class, 'trialBalance'])->name('reports.trial-balance');
        Route::get('/reports/profit-loss', [JournalEntryController::class, 'profitLoss'])->name('reports.profit-loss');
        Route::get('/reports/balance-sheet', [JournalEntryController::class, 'balanceSheet'])->name('reports.balance-sheet');
        Route::get('/reports/general-ledger', [JournalEntryController::class, 'generalLedger'])->name('reports.general-ledger');
    });



    /*
    |--------------------------------------------------------------------------
    | Phase 5: HRM Management Routes
    |--------------------------------------------------------------------------
    */
    Route::prefix('hrm')->name('hrm.')->group(function () {
        
        // Departments
        Route::resource('departments', DepartmentController::class);
        Route::post('/departments/{department}/status', [DepartmentController::class, 'updateStatus'])->name('departments.status');

        // Employees
        Route::resource('employees', EmployeeController::class);
        Route::post('/employees/{employee}/status', [EmployeeController::class, 'updateStatus'])->name('employees.status');

        // Attendances
        Route::get('/attendances/report', [AttendanceController::class, 'report'])->name('attendances.report');
        Route::resource('attendances', AttendanceController::class);

        // Leave Types
        Route::resource('leave-types', LeaveTypeController::class);
        Route::post('/leave-types/{leaveType}/status', [LeaveTypeController::class, 'updateStatus'])->name('leave-types.status');

        // Leave Applications
        Route::resource('leave-applications', LeaveApplicationController::class);
        Route::post('/leave-applications/{leaveApplication}/approve', [LeaveApplicationController::class, 'approve'])->name('leave-applications.approve');
        Route::post('/leave-applications/{leaveApplication}/reject', [LeaveApplicationController::class, 'reject'])->name('leave-applications.reject');
        Route::post('/leave-applications/{leaveApplication}/cancel', [LeaveApplicationController::class, 'cancel'])->name('leave-applications.cancel');

        // Holidays
        Route::resource('holidays', HolidayController::class);
        Route::post('/holidays/{holiday}/status', [HolidayController::class, 'updateStatus'])->name('holidays.status');

        // Salary Structures
        Route::resource('salary-structures', SalaryStructureController::class);
        Route::post('/salary-structures/{salaryStructure}/status', [SalaryStructureController::class, 'updateStatus'])->name('salary-structures.status');

        // Payrolls
        Route::resource('payrolls', PayrollController::class);
        Route::post('/payrolls/process', [PayrollController::class, 'process'])->name('payrolls.process');
        Route::post('/payrolls/{payroll}/mark-paid', [PayrollController::class, 'markPaid'])->name('payrolls.mark-paid');

        // Payslips
        Route::get('/payslips', [PayslipController::class, 'index'])->name('payslips.index');
        Route::get('/payslips/{payslip}', [PayslipController::class, 'show'])->name('payslips.show');
        Route::get('/payslips/{payslip}/download', [PayslipController::class, 'download'])->name('payslips.download');
    });


    /*
    |--------------------------------------------------------------------------
    | Phase 6: SaaS Billing, Notifications & Common
    |--------------------------------------------------------------------------
    */
    Route::prefix('saas')->name('saas.')->group(function () {

        // Payment Gateways (Super Admin only)
        Route::resource('payment-gateways', PaymentGatewayController::class);
        Route::post('/payment-gateways/{paymentGateway}/status', [PaymentGatewayController::class, 'updateStatus'])->name('payment-gateways.status');

        // Subscription Invoices
        Route::resource('subscription-invoices', SubscriptionInvoiceController::class);
        Route::get('/subscription-invoices/{subscriptionInvoice}/pdf', [SubscriptionInvoiceController::class, 'pdf'])->name('subscription-invoices.pdf');

        // Subscription Payments
        Route::resource('subscription-payments', SubscriptionPaymentController::class)->except(['edit']);
        Route::post('/subscription-payments/{subscriptionPayment}/verify', [SubscriptionPaymentController::class, 'verify'])->name('subscription-payments.verify');
        Route::post('/subscription-payments/{subscriptionPayment}/refund', [SubscriptionPaymentController::class, 'refund'])->name('subscription-payments.refund');

        // Revenue Reports
        Route::get('/revenue', [RevenueReportController::class, 'index'])->name('revenue.index');
        Route::get('/revenue/export', [RevenueReportController::class, 'export'])->name('revenue.export');

        // Audit Logs
        Route::get('/audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');
        Route::get('/audit-logs/{auditLog}', [AuditLogController::class, 'show'])->name('audit-logs.show');
    });

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('/', [NotificationController::class, 'index'])->name('index');
        Route::get('/recent', [NotificationController::class, 'recent'])->name('recent');
        Route::get('/unread-count', [NotificationController::class, 'unreadCount'])->name('unread-count');
        Route::post('/{notification}/read', [NotificationController::class, 'markAsRead'])->name('read');
        Route::post('/read-all', [NotificationController::class, 'markAllAsRead'])->name('read-all');
        Route::delete('/{notification}', [NotificationController::class, 'destroy'])->name('destroy');
        Route::get('/create', [NotificationController::class, 'create'])->name('create');
        Route::post('/', [NotificationController::class, 'store'])->name('store');
    });

    Route::post('/attachments', [AttachmentController::class, 'store'])->name('attachments.store');
    Route::delete('/attachments/{attachment}', [AttachmentController::class, 'destroy'])->name('attachments.destroy');

    Route::get('/subscription/expired', fn () => view('subscription.expired'))->name('subscription.expired');

});