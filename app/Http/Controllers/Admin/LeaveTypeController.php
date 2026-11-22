<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hrm\LeaveTypeRequest;
use App\Models\LeaveType;
use App\Services\LeaveTypeService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LeaveTypeController extends Controller
{
    public function __construct(protected LeaveTypeService $service) {}

    public function index(){
        return Inertia::render('Hrm/LeaveTypes/Index', [
            'leaveTypes' => $this->service->getAll(),
        ]);
    }

    public function store(LeaveTypeRequest $request){
        $this->service->create($request->validated());
        return back()->with('success', 'Leave type created successfully.');
    }

    public function update(LeaveTypeRequest $request, LeaveType $leaveType){
        $this->service->update($leaveType, $request->validated());
        return back()->with('success', 'Leave type updated successfully.');
    }

    public function destroy(LeaveType $leaveType){
        $this->service->delete($leaveType);
        return back()->with('success', 'Leave type deleted successfully.');
    }

    public function updateStatus(Request $request, LeaveType $leaveType){
        $this->service->updateStatus($leaveType, $request->status);
        return back()->with('success', 'Status updated successfully.');
    }
}