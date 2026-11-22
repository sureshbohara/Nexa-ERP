<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transactions\SaleReturnRequest;
use App\Models\SaleReturn;
use App\Models\Customer;
use App\Models\Sale;
use App\Models\Product;
use App\Models\Warehouse;
use App\Services\SaleReturnService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SaleReturnController extends Controller
{
    public function __construct(protected SaleReturnService $service) {}

    public function index()
    {
        return Inertia::render('Transactions/SaleReturns/Index', [
            'returns' => $this->service->getAll(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Transactions/SaleReturns/Form', [
            'saleReturn' => null,
            'customers' => Customer::where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'sales' => Sale::whereIn('status', ['completed', 'pending'])->orderByDesc('id')->get(['id', 'reference_no', 'customer_id', 'total_amount', 'paid_amount']),
            'products' => Product::where('status', 'active')->orderBy('name')->get(['id', 'name', 'sku']),
            'warehouses' => Warehouse::where('status', 'active')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(SaleReturnRequest $request)
    {
        $this->service->create($request->validated(), $request->user());

        return redirect()
            ->route('transactions.sale-returns.index')
            ->with('success', 'Sale Return created successfully.');
    }

    public function edit(SaleReturn $saleReturn)
    {
        $saleReturn->load(['customer', 'sale', 'items']);

        return Inertia::render('Transactions/SaleReturns/Form', [
            'saleReturn' => $saleReturn,
            'customers' => Customer::where('status', 'active')->orderBy('name')->get(['id', 'name']),
            'sales' => Sale::whereIn('status', ['completed', 'pending'])->orderByDesc('id')->get(['id', 'reference_no', 'customer_id', 'total_amount', 'paid_amount']),
            'products' => Product::where('status', 'active')->orderBy('name')->get(['id', 'name', 'sku']),
            'warehouses' => Warehouse::where('status', 'active')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(SaleReturnRequest $request, SaleReturn $saleReturn)
    {
        $this->service->update($saleReturn, $request->validated(), $request->user());

        return redirect()
            ->route('transactions.sale-returns.index')
            ->with('success', 'Sale Return updated successfully.');
    }

    public function destroy(SaleReturn $saleReturn)
    {
        $this->service->delete($saleReturn);

        return redirect()
            ->route('transactions.sale-returns.index')
            ->with('success', 'Sale Return deleted successfully.');
    }

    public function updateStatus(Request $request, SaleReturn $saleReturn)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:pending,completed,cancelled'],
        ]);

        $this->service->updateStatus($saleReturn, $validated['status']);

        return back()->with('success', 'Sale Return status updated successfully.');
    }
}