<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\WarehouseRequest;
use App\Models\Warehouse;
use App\Services\WarehouseService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarehouseController extends Controller
{
    public function __construct(protected WarehouseService $service) {}

    public function index() {
        return Inertia::render('Inventory/Warehouses/Index', [
            'warehouses' => $this->service->getAll(),
            'branches' => $this->service->getBranches(),
        ]);
    }

    public function store(WarehouseRequest $request) {
        $this->service->create($request->validated());
        return back()->with('success', 'Warehouse created successfully.');
    }

    public function update(WarehouseRequest $request, Warehouse $warehouse) {
        $this->service->update($warehouse, $request->validated());
        return back()->with('success', 'Warehouse updated successfully.');
    }

    public function destroy(Warehouse $warehouse) {
        $this->service->delete($warehouse);
        return back()->with('success', 'Warehouse deleted successfully.');
    }

    public function updateStatus(Request $request, Warehouse $warehouse) {
        $request->validate(['status' => 'required|in:active,inactive']);
        $this->service->updateStatus($warehouse, $request->status);
        return back()->with('success', 'Warehouse status updated successfully.');
    }
}