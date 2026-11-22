<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SubscriptionInvoice;
use App\Models\Subscription;
use App\Models\AuditLog;
use App\Models\LeaveApplication;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function dashboard()
    {
        $user = auth()->user();
        $orgId = $user?->organization_id;

    
        $applyOrgScope = function ($query) use ($orgId) {
            if ($orgId) {
                return $query->where('organization_id', $orgId);
            }
            return $query;
        };

    
        $totalProducts = Product::where($applyOrgScope)->count();

     
        $thisMonthRevenue = Sale::where($applyOrgScope)
            ->whereMonth('sale_date', now()->month)
            ->whereYear('sale_date', now()->year)
            ->sum('total_amount');

 
        $pendingInvoicesQuery = SubscriptionInvoice::where($applyOrgScope)->whereIn('status', ['unpaid', 'partial']);
        $pendingInvoicesCount = $pendingInvoicesQuery->count();
        $pendingInvoicesAmount = $pendingInvoicesQuery->sum(DB::raw('total_amount - paid_amount'));

    
        $activeSubscriptions = Subscription::where($applyOrgScope)
            ->where('status', 'active')
            ->count();

   
        $lowStockProducts = DB::table('product_stocks')
            ->join('products', 'product_stocks.product_id', '=', 'products.id')
            ->when($orgId, fn($q) => $q->where('product_stocks.organization_id', $orgId))
            ->whereColumn('product_stocks.quantity', '<=', 'products.low_stock_threshold')
            ->where('products.low_stock_threshold', '>', 0)
            ->count();

     
        $expiringSubscriptions = Subscription::where($applyOrgScope)
            ->where('status', 'active')
            ->where('end_date', '>=', now())
            ->where('end_date', '<=', now()->addDays(30))
            ->count();

     
        $pendingLeaves = LeaveApplication::where($applyOrgScope)
            ->where('status', 'pending')
            ->count();

      
        $sixMonthsAgo = now()->subMonths(5)->startOfMonth();
        $sales = Sale::where($applyOrgScope)
            ->where('sale_date', '>=', $sixMonthsAgo)
            ->get(['sale_date', 'total_amount']);

        $monthlyRevenue = $sales->groupBy(function ($item) {
            return Carbon::parse($item->sale_date)->format('Y-m');
        })->map(function ($group, $month) {
            return [
                'month' => Carbon::parse($month)->format('M'),
                'amount' => (float) $group->sum('total_amount'),
            ];
        })->values();

        // Fallback if no sales data exists yet
        if ($monthlyRevenue->isEmpty()) {
            $monthlyRevenue = collect(range(5, 0))->map(function ($i) {
                return [
                    'month' => now()->subMonths($i)->format('M'),
                    'amount' => 0.0,
                ];
            });
        }

    
        $recentActivities = AuditLog::where($applyOrgScope)
            ->with(['user:id,first_name,last_name'])
            ->latest('created_at')
            ->take(5)
            ->get()
            ->map(function ($log) {
                $userName = $log->user ? trim("{$log->user->first_name} {$log->user->last_name}") : 'System';
                
                $icon = match($log->event) {
                    'created' => 'check',
                    'updated' => 'edit',
                    'deleted' => 'alert',
                    default => 'file',
                };
                
                $color = match($log->event) {
                    'created' => 'green',
                    'updated' => 'blue',
                    'deleted' => 'red',
                    default => 'gray',
                };

                $target = class_basename($log->auditable_type) ?: 'record';
                $action = match($log->event) {
                    'created' => 'created a new',
                    'updated' => 'updated',
                    'deleted' => 'deleted',
                    default => 'interacted with',
                };

                return [
                    'id' => $log->id,
                    'icon' => $icon,
                    'color' => $color,
                    'title' => ucfirst($userName) . ' ' . $action . ' ' . strtolower($target),
                    'subtitle' => $log->created_at->diffForHumans(),
                ];
            });

     
        if ($recentActivities->isEmpty()) {
            $recentActivities = collect([[
                'id' => 0,
                'icon' => 'check',
                'color' => 'green',
                'title' => 'System initialized and ready',
                'subtitle' => 'Just now',
            ]]);
        }

        return Inertia::render('Dashboard', [
            'stats' => [
                'products' => $totalProducts,
                'revenue' => (float) $thisMonthRevenue,
                'pendingInvoicesCount' => $pendingInvoicesCount,
                'pendingInvoicesAmount' => (float) $pendingInvoicesAmount,
                'subscriptions' => $activeSubscriptions,
                'lowStockProducts' => $lowStockProducts,
                'expiringSubscriptions' => $expiringSubscriptions,
                'pendingLeaves' => $pendingLeaves,
            ],
            'monthlyRevenue' => $monthlyRevenue,
            'recentActivities' => $recentActivities,
        ]);
    }
}