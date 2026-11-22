<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transactions\SupplierRequest;
use App\Models\Supplier;
use App\Services\SupplierService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function __construct(protected SupplierService $service) {}


    public function index(){
        return Inertia::render('Transactions/Suppliers/Index', [
            'suppliers' => $this->service->getAll(),
        ]);
    }

    public function store(SupplierRequest $request){
        $this->service->create($request->validated());

        return back()->with('success', 'Supplier created successfully.');
    }

    public function update(SupplierRequest $request, Supplier $supplier){
        $this->service->update($supplier, $request->validated());

        return back()->with('success', 'Supplier updated successfully.');
    }

    public function destroy(Supplier $supplier){
        $this->service->delete($supplier);

        return back()->with('success', 'Supplier deleted successfully.');
    }

    public function updateStatus(Request $request, Supplier $supplier){
        $request->validate([
            'status' => ['required', 'in:active,inactive'],
        ]);
        $this->service->updateStatus($supplier, $request->status);
        return back()->with('success', 'Supplier status updated successfully.');
    }
}