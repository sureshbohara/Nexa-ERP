<?php

namespace App\Providers;

use App\Models\Product;
use App\Models\Sale;
use App\Models\Purchase;
use App\Models\Customer;
use App\Models\Supplier;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\LeaveApplication;
use App\Models\Payroll;
use App\Models\Subscription;
use App\Models\SubscriptionInvoice;
use App\Models\SubscriptionPayment;
use App\Models\PaymentGateway;
use App\Models\Plan;
use App\Models\Organization;
use App\Models\Branch;
use App\Models\User;
use App\Models\Role;
use App\Observers\AuditableObserver;
use Illuminate\Support\ServiceProvider;

class AuditServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Inventory
        Product::observe(AuditableObserver::class);
        
        // Transactions
        Sale::observe(AuditableObserver::class);
        Purchase::observe(AuditableObserver::class);
        Customer::observe(AuditableObserver::class);
        Supplier::observe(AuditableObserver::class);
        
        // HRM
        Employee::observe(AuditableObserver::class);
        Attendance::observe(AuditableObserver::class);
        LeaveApplication::observe(AuditableObserver::class);
        Payroll::observe(AuditableObserver::class);
        
        // SaaS
        Subscription::observe(AuditableObserver::class);
        SubscriptionInvoice::observe(AuditableObserver::class);
        SubscriptionPayment::observe(AuditableObserver::class);
        PaymentGateway::observe(AuditableObserver::class);
        Plan::observe(AuditableObserver::class);
        
        // System
        Organization::observe(AuditableObserver::class);
        Branch::observe(AuditableObserver::class);
        User::observe(AuditableObserver::class);
        Role::observe(AuditableObserver::class);
    }
}