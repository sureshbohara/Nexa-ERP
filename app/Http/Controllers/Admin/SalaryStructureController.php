<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hrm\SalaryStructureRequest;
use App\Models\SalaryStructure;
use App\Services\SalaryStructureService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class SalaryStructureController extends Controller
{
    public function __construct(protected SalaryStructureService $service) {}

    public function index() {
        return Inertia::render('Hrm/SalaryStructures/Index', [
            'salaryStructures' => $this->service->getAll(),
        ]);
    }

 
    public function create() {
        return Inertia::render('Hrm/SalaryStructures/Form', [
            'salaryStructure' => null,
        ]);
    }

    public function store(SalaryStructureRequest $request) {
        $this->service->create($request->validated());
        return redirect()->route('hrm.salary-structures.index')->with('success', 'Salary structure created successfully.');
    }

 
    public function edit(SalaryStructure $salaryStructure) {
        return Inertia::render('Hrm/SalaryStructures/Form', [
            'salaryStructure' => $salaryStructure,
        ]);
    }

    public function update(SalaryStructureRequest $request, SalaryStructure $salaryStructure) {
        $this->service->update($salaryStructure, $request->validated());
        return redirect()->route('hrm.salary-structures.index')->with('success', 'Salary structure updated successfully.');
    }

    public function destroy(SalaryStructure $salaryStructure) {
        $this->service->delete($salaryStructure);
        return back()->with('success', 'Salary structure deleted successfully.');
    }

    public function updateStatus(Request $request, SalaryStructure $salaryStructure) {
        $this->service->updateStatus($salaryStructure, $request->status);
        return back()->with('success', 'Status updated successfully.');
    }
}