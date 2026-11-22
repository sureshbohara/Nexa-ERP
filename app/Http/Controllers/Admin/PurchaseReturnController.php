<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transactions\PurchaseReturnRequest;
use App\Models\PurchaseReturn;
use App\Models\Supplier;
use App\Models\Purchase;
use App\Models\Product;
use App\Models\Warehouse;
use App\Services\PurchaseReturnService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseReturnController extends Controller
{
    public function __construct(protected PurchaseReturnService $service) {}

    public function index(){
        return Inertia::render('Transactions/PurchaseReturns/Index', [
            'returns' => $this->service->getAll(),
        ]);
    }

    public function create(){
        return Inertia::render('Transactions/PurchaseReturns/Form', [
            'purchaseReturn' => null,
            'suppliers' => Supplier::where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'purchases' => Purchase::whereIn('status', ['completed', 'pending'])->orderByDesc('id')->get(['id', 'reference_no', 'supplier_id', 'total_amount', 'paid_amount']),
            'products' => Product::where('status', 'active')->orderBy('name')->get(['id', 'name', 'sku']),
            'warehouses' => Warehouse::where('status', 'active')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(PurchaseReturnRequest $request){
        $this->service->create($request->validated(), $request->user());

        return redirect()
            ->route('transactions.purchase-returns.index')
            ->with('success', 'Purchase Return created successfully.');
    }

    public function edit(PurchaseReturn $purchaseReturn){
        $purchaseReturn->load(['supplier', 'purchase', 'items']);

        return Inertia::render('Transactions/PurchaseReturns/Form', [
            'purchaseReturn' => $purchaseReturn,
            'suppliers' => Supplier::where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'purchases' => Purchase::whereIn('status', ['completed', 'pending'])->orderByDesc('id')->get(['id', 'reference_no', 'supplier_id', 'total_amount', 'paid_amount']),
            'products' => Product::where('status', 'active')->orderBy('name')->get(['id', 'name', 'sku']),
            'warehouses' => Warehouse::where('status', 'active')->orderBy('name')->get(['id', 'name']),
        ]);
    }


    public function update(PurchaseReturnRequest $request, PurchaseReturn $purchaseReturn){
        $this->service->update($purchaseReturn, $request->validated(), $request->user());

        return redirect()
            ->route('transactions.purchase-returns.index')
            ->with('success', 'Purchase Return updated successfully.');
    }



    public function destroy(PurchaseReturn $purchaseReturn){
        $this->service->delete($purchaseReturn);

        return redirect()
            ->route('transactions.purchase-returns.index')
            ->with('success', 'Purchase Return deleted successfully.');
    }

    public function updateStatus(Request $request, PurchaseReturn $purchaseReturn){
        $validated = $request->validate([
            'status' => ['required', 'in:pending,completed,cancelled'],
        ]);
        $this->service->updateStatus($purchaseReturn, $validated['status']);
        return back()->with('success', 'Purchase Return status updated successfully.');
    }

    
}