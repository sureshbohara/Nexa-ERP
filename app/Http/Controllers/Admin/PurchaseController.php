<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transactions\PurchaseRequest;
use App\Http\Requests\Transactions\PurchasePaymentRequest;
use App\Models\Account;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Services\PurchaseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function __construct(protected PurchaseService $service) {}


    public function index(){
        return Inertia::render('Transactions/Purchases/Index', [
            'purchases' => $this->service->getAll(),
        ]);
    }


    public function create(){
        $lastPurchase = Purchase::latest('id')->first();
        $nextNumber = $lastPurchase ? (intval(substr($lastPurchase->reference_no, 4)) + 1) : 1;
        $referenceNo = 'PUR-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
        return Inertia::render('Transactions/Purchases/Form', [
            'purchase' => null,
            'referenceNo' => $referenceNo,
            'suppliers' => Supplier::where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'products' => Product::where('status', 'active')->orderBy('name')->get(['id', 'name', 'sku', 'selling_price']),
            'warehouses' => Warehouse::where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'accounts' => Account::where('status', 'active')->get(['id', 'name', 'code', 'type']), 
        ]);
    }


    public function store(PurchaseRequest $request){
        $this->service->create($request->validated());
        return redirect()->route('transactions.purchases.index')->with('success', 'Purchase created successfully.');
    }



    public function edit(Purchase $purchase){
        $purchase->load(['supplier', 'items', 'payments']); 
        return Inertia::render('Transactions/Purchases/Form', [
            'purchase' => $purchase,
            'referenceNo' => $purchase->reference_no,
            'suppliers' => Supplier::where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'products' => Product::where('status', 'active')->orderBy('name')->get(['id', 'name', 'sku', 'selling_price']),
            'warehouses' => Warehouse::where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'accounts' => Account::where('status', 'active')->get(['id', 'name', 'code', 'type']), 
        ]);
    }



    public function update(PurchaseRequest $request, Purchase $purchase){
        $this->service->update($purchase, $request->validated());
        return redirect()->route('transactions.purchases.index')->with('success', 'Purchase updated successfully.');
    }


    public function destroy(Purchase $purchase){
        $this->service->delete($purchase);
        return redirect()->route('transactions.purchases.index')->with('success', 'Purchase deleted successfully.');
    }



    public function updateStatus(Request $request, Purchase $purchase){
        $validated = $request->validate(['status' => ['required', 'in:pending,completed,cancelled']]);
        $this->service->updateStatus($purchase, $validated['status']);
        return back()->with('success', 'Purchase status updated successfully.');
    }



    public function addPayment(PurchasePaymentRequest $request, Purchase $purchase){
        $this->service->addPayment($purchase, $request->validated(), $request->user());
        return back()->with('success', 'Payment added successfully.');
    }

    
}