<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionInvoice;
use App\Models\SubscriptionPayment;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class RevenueReportController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $orgId = $user->organization_id;

        $invoiceQuery = SubscriptionInvoice::query();
        $paymentQuery = SubscriptionPayment::where('status', 'paid');

        if ($orgId) {
            $invoiceQuery->where('organization_id', $orgId);
            $paymentQuery->where('organization_id', $orgId);
        }

      
        $totalInvoiced = $invoiceQuery->sum('total_amount');
        $totalCollected = $paymentQuery->sum('amount');
        $totalPending = max(0, (float)$totalInvoiced - (float)$totalCollected);


        $twelveMonthsAgo = now()->subMonths(12)->startOfMonth();
        
        $recentPaymentsForGrouping = SubscriptionPayment::where('status', 'paid')
            ->when($orgId, fn($q) => $q->where('organization_id', $orgId))
            ->where('payment_date', '>=', $twelveMonthsAgo)
            ->get(['payment_date', 'amount', 'id']);

        $monthlyRevenue = $recentPaymentsForGrouping
            ->groupBy(function ($payment) {
          
                return Carbon::parse($payment->payment_date)->format('Y-m');
            })
            ->map(function ($payments, $month) {
                return [
                    'month' => $month,
                    'total_amount' => (float) $payments->sum('amount'),
                    'transaction_count' => $payments->count(),
                ];
            })
            ->sortBy('month')
            ->values()
            ->all();


        $recentPayments = $paymentQuery
            ->with(['organization:id,name', 'invoice:id,invoice_no'])
            ->latest('payment_date')
            ->take(10)
            ->get();

        return Inertia::render('Saas/RevenueReports/Index', [
            'summary' => [
                'total_invoiced' => (float) $totalInvoiced,
                'total_collected' => (float) $totalCollected,
                'total_pending' => (float) $totalPending,
            ],
            'monthly_revenue' => $monthlyRevenue,
            'recent_payments' => $recentPayments,
        ]);
    }

    public function export()
    {
        return back()->with('info', 'Export feature coming soon.');
    }
}