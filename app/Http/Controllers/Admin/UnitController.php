<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\UnitRequest;
use App\Models\Unit;
use App\Services\UnitService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function __construct(protected UnitService $service) {}

    public function index() {
        return Inertia::render('Inventory/Units/Index', [
            'units' => $this->service->getAll(),
        ]);
    }

    public function store(UnitRequest $request) {
        $this->service->create($request->validated());
        return back()->with('success', 'Unit created successfully.');
    }

    public function update(UnitRequest $request, Unit $unit) {
        $this->service->update($unit, $request->validated());
        return back()->with('success', 'Unit updated successfully.');
    }

    public function destroy(Unit $unit) {
        $this->service->delete($unit);
        return back()->with('success', 'Unit deleted successfully.');
    }

    public function updateStatus(Request $request, Unit $unit) {
        $request->validate(['status' => 'required|in:active,inactive']);
        $this->service->updateStatus($unit, $request->status);
        return back()->with('success', 'Unit status updated successfully.');
    }
}