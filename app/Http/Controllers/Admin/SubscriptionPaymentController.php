<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\Saas\SubscriptionPaymentRequest;
use App\Models\SubscriptionPayment;
use App\Models\Subscription;
use App\Models\SubscriptionInvoice;
use App\Models\PaymentGateway;
use App\Services\SubscriptionPaymentService;
use Inertia\Inertia;

class SubscriptionPaymentController extends Controller
{

    public function __construct(protected SubscriptionPaymentService $service) {}

    public function index() {
        $orgId = auth()->user()->organization_id;
        $subQuery = Subscription::query();
        $invQuery = SubscriptionInvoice::query();
        $gateQuery = PaymentGateway::query()->where('is_active', true);

        if ($orgId) {
            $subQuery->where('organization_id', $orgId);
            $invQuery->where('organization_id', $orgId);
        }

        return Inertia::render('Saas/SubscriptionPayments/Index', [
            'payments' => $this->service->getAll(),
            'subscriptions' => $subQuery->get(['id', 'id']), 
            'invoices' => $invQuery->unpaid()->get(['id', 'invoice_no', 'total_amount', 'paid_amount']),
            'gateways' => $gateQuery->get(['id', 'name']),
        ]);
    }


    public function store(SubscriptionPaymentRequest $request) {
        $this->service->create($request->validated());
        return back()->with('success', 'Payment recorded successfully.');
    }


    public function update(SubscriptionPaymentRequest $request, SubscriptionPayment $subscriptionPayment) {
        $this->service->update($subscriptionPayment, $request->validated());
        return back()->with('success', 'Payment updated successfully.');
    }


    public function destroy(SubscriptionPayment $subscriptionPayment) {
        $this->service->delete($subscriptionPayment);
        return back()->with('success', 'Payment deleted successfully.');
    }
    
}