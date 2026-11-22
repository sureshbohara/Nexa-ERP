<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hrm\LeaveApplicationRequest;
use App\Models\LeaveApplication;
use App\Models\Employee;
use App\Models\LeaveType;
use App\Models\Scopes\OrganizationScope;
use App\Services\LeaveApplicationService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LeaveApplicationController extends Controller
{
    public function __construct(protected LeaveApplicationService $service) {}

    public function index(){
        $orgId = auth()->user()->organization_id;

        $empQuery = Employee::withoutGlobalScope(OrganizationScope::class)->with('user:id,first_name,last_name');
        $ltQuery = LeaveType::withoutGlobalScope(OrganizationScope::class);

        if ($orgId) {
            $empQuery->where('organization_id', $orgId);
            $ltQuery->where('organization_id', $orgId);
        } else {
            $empQuery->whereIn('organization_id', [1, null]);
            $ltQuery->whereIn('organization_id', [1, null]);
        }

        return Inertia::render('Hrm/LeaveApplications/Index', [
            'applications' => $this->service->getAll(),
            'employees' => $empQuery->get(['id', 'employee_code']),
            'leaveTypes' => $ltQuery->where('status', 'active')->get(['id', 'name']),
        ]);
    }

    public function store(LeaveApplicationRequest $request){
        $this->service->create($request->validated());
        return back()->with('success', 'Leave application submitted successfully.');
    }

    public function update(LeaveApplicationRequest $request, LeaveApplication $application){
        $this->service->update($application, $request->validated());
        return back()->with('success', 'Leave application updated successfully.');
    }

    public function destroy(LeaveApplication $application){
        $this->service->delete($application);
        return back()->with('success', 'Leave application deleted successfully.');
    }

    public function approve(LeaveApplication $application){
        $this->service->approve($application);
        return back()->with('success', 'Leave application approved.');
    }

    public function reject(Request $request, LeaveApplication $application){
        $this->service->reject($application, $request->rejection_reason ?? 'Rejected');
        return back()->with('success', 'Leave application rejected.');
    }
}