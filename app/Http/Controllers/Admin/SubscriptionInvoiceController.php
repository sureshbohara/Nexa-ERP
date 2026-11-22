<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\Saas\SubscriptionInvoiceRequest;
use App\Models\SubscriptionInvoice;
use App\Models\Subscription;
use App\Models\Organization;
use App\Services\SubscriptionInvoiceService;
use Inertia\Inertia;

class SubscriptionInvoiceController extends Controller
{
    public function __construct(protected SubscriptionInvoiceService $service) {}

    public function index() {
        $orgId = auth()->user()->organization_id;
        $query = Organization::query();
        $subQuery = Subscription::query();
        
        if ($orgId) {
            $query->where('id', $orgId);
            $subQuery->where('organization_id', $orgId);
        }

        return Inertia::render('Saas/SubscriptionInvoices/Index', [
            'invoices' => $this->service->getAll(),
            'organizations' => $query->get(['id', 'name']),
            'subscriptions' => $subQuery->get(['id', 'id', 'plan_name']),
        ]);
    }

    public function store(SubscriptionInvoiceRequest $request) {
        $this->service->create($request->validated());
        return back()->with('success', 'Invoice created successfully.');
    }

    public function update(SubscriptionInvoiceRequest $request, SubscriptionInvoice $subscriptionInvoice) {
        $this->service->update($subscriptionInvoice, $request->validated());
        return back()->with('success', 'Invoice updated successfully.');
    }

    public function destroy(SubscriptionInvoice $subscriptionInvoice) {
        $this->service->delete($subscriptionInvoice);
        return back()->with('success', 'Invoice deleted successfully.');
    }
}