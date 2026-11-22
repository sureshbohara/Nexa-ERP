<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transactions\SaleRequest;
use App\Http\Requests\Transactions\SalePaymentRequest;
use App\Models\Account;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;
use App\Models\Warehouse;
use App\Services\SaleService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleController extends Controller
{
    
    public function __construct(protected SaleService $service) {}


    public function index(){
        return Inertia::render('Transactions/Sales/Index', [
            'sales' => $this->service->getAll(),
        ]);
    }



    public function create(){
        $lastSale = Sale::latest('id')->first();
        $nextNumber = $lastSale ? (intval(substr($lastSale->reference_no, 4)) + 1) : 1;
        $referenceNo = 'INV-' . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);

        return Inertia::render('Transactions/Sales/Form', [
            'sale' => null,
            'referenceNo' => $referenceNo,
            'customers' => Customer::where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'products' => Product::where('status', 'active')->orderBy('name')->get(['id', 'name', 'sku', 'selling_price']),
            'warehouses' => Warehouse::where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'accounts' => Account::where('status', 'active')->get(['id', 'name', 'code', 'type']), 
        ]);
    }



    public function store(SaleRequest $request){
        $this->service->create($request->validated());
        return redirect()->route('transactions.sales.index')->with('success', 'Sale created successfully.');
    }



    public function edit(Sale $sale){
        $sale->load(['customer', 'items']);
        return Inertia::render('Transactions/Sales/Form', [
            'sale' => $sale,
            'referenceNo' => $sale->reference_no,
            'customers' => Customer::where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'products' => Product::where('status', 'active')->orderBy('name')->get(['id', 'name', 'sku', 'selling_price']),
            'warehouses' => Warehouse::where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'accounts' => Account::where('status', 'active')->get(['id', 'name', 'code', 'type']), 
        ]);
    }



    public function update(SaleRequest $request, Sale $sale){
        $this->service->update($sale, $request->validated());
        return redirect()->route('transactions.sales.index')->with('success', 'Sale updated successfully.');
    }



    public function destroy(Sale $sale){
        $this->service->delete($sale);
        return redirect()->route('transactions.sales.index')->with('success', 'Sale deleted successfully.');
    }



    public function updateStatus(Request $request, Sale $sale){
        $validated = $request->validate(['status' => ['required', 'in:pending,completed,cancelled']]);
        $this->service->updateStatus($sale, $validated['status']);
        return back()->with('success', 'Sale status updated successfully.');
    }



    public function addPayment(SalePaymentRequest $request, Sale $sale){
        $this->service->addPayment($sale, $request->validated(), $request->user());
        return back()->with('success', 'Payment added successfully.');
    }



    public function updateField(Request $request, Sale $sale){
        $validated = $request->validate([
            'field' => ['required', 'in:status,delivery_status'], 
            'value' => ['required', 'string'],
        ]);
        $field = $validated['field'];
        $value = $validated['value'];        
        $sale->update([$field => $value]);
        return back()->with('success', ucfirst(str_replace('_', ' ', $field)) . ' updated successfully.');
    }


}