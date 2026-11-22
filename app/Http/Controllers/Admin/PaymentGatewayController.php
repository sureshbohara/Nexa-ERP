<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\Saas\PaymentGatewayRequest;
use App\Models\PaymentGateway;
use App\Services\PaymentGatewayService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PaymentGatewayController extends Controller
{


    public function __construct(protected PaymentGatewayService $service) {}

    public function index() {
        return Inertia::render('Saas/PaymentGateways/Index', ['gateways' => $this->service->getAll()]);
    }


    public function store(PaymentGatewayRequest $request) {
        $this->service->create($request->validated());
        return back()->with('success', 'Payment gateway added successfully.');
    }


    public function update(PaymentGatewayRequest $request, PaymentGateway $paymentGateway) {
        $this->service->update($paymentGateway, $request->validated());
        return back()->with('success', 'Payment gateway updated successfully.');
    }


    public function destroy(PaymentGateway $paymentGateway) {
        $this->service->delete($paymentGateway);
        return back()->with('success', 'Payment gateway deleted successfully.');
    }

    public function updateStatus(Request $request, PaymentGateway $paymentGateway) {
        $this->service->update($paymentGateway, ['is_active' => $request->status === 'active']);
        return back()->with('success', 'Status updated successfully.');
    }
    
}