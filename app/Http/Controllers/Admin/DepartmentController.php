<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hrm\DepartmentRequest;
use App\Models\Department;
use App\Models\User;
use App\Services\DepartmentService;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function __construct(protected DepartmentService $service) {}

    public function index() {
        return Inertia::render('Hrm/Departments/Index', [
            'departments' => $this->service->getAll(),
            'users' => User::select('id', 'first_name', 'last_name')->get(), 
        ]);
    }

    public function store(DepartmentRequest $request) {
        $this->service->create($request->validated());
        return back()->with('success', 'Department created successfully.');
    }

    public function update(DepartmentRequest $request, Department $department) {
        $this->service->update($department, $request->validated());
        return back()->with('success', 'Department updated successfully.');
    }

    public function destroy(Department $department) {
        $this->service->delete($department);
        return back()->with('success', 'Department deleted successfully.');
    }

    public function updateStatus(\Illuminate\Http\Request $request, Department $department) {
        $this->service->updateStatus($department, $request->status);
        return back()->with('success', 'Status updated successfully.');
    }
}