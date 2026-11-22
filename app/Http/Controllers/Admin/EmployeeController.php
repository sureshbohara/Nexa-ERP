<?php
namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;
use App\Http\Requests\Hrm\EmployeeRequest;
use App\Models\Employee;
use App\Models\User;
use App\Models\Department;
use App\Models\Branch;
use App\Models\SalaryStructure;
use App\Services\EmployeeService;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function __construct(protected EmployeeService $service) {}


       public function index() {
        $orgId = auth()->user()->organization_id;
        
        $usersQuery = User::query();
        $deptQuery = Department::query();
        $branchQuery = Branch::query();
        $salaryQuery = SalaryStructure::query();

        if ($orgId) {
            $usersQuery->where('organization_id', $orgId);
            $deptQuery->where('organization_id', $orgId);
            $branchQuery->where('organization_id', $orgId);
            $salaryQuery->where('organization_id', $orgId);
        } else {

            $usersQuery->whereIn('organization_id', [1, null]);
            $deptQuery->whereIn('organization_id', [1, null]);
            $branchQuery->whereIn('organization_id', [1, null]);
            $salaryQuery->whereIn('organization_id', [1, null]);
        }


        return Inertia::render('Hrm/Employees/Index', [
            'employees' => $this->service->getAll(),
            'users' => $usersQuery->withoutGlobalScope(\App\Models\Scopes\OrganizationScope::class)
                                  ->select('id', 'first_name', 'last_name', 'email')
                                  ->get(),
            'departments' => $deptQuery->withoutGlobalScope(\App\Models\Scopes\OrganizationScope::class)
                                       ->where('status', 'active')
                                       ->select('id', 'name')
                                       ->get(),
            'branches' => $branchQuery->withoutGlobalScope(\App\Models\Scopes\OrganizationScope::class)
                                      ->where('status', 'active')
                                      ->select('id', 'name')
                                      ->get(),
            'salaryStructures' => $salaryQuery->withoutGlobalScope(\App\Models\Scopes\OrganizationScope::class)
                                              ->where('status', 'active')
                                              ->select('id', 'name')
                                              ->get(),
        ]);
    }


    public function store(EmployeeRequest $request) {
        $this->service->create($request->validated());
        return back()->with('success', 'Employee created successfully.');
    }



    public function update(EmployeeRequest $request, Employee $employee) {
        $this->service->update($employee, $request->validated());
        return back()->with('success', 'Employee updated successfully.');
    }



    public function destroy(Employee $employee) {
        $this->service->delete($employee);
        return back()->with('success', 'Employee deleted successfully.');
    }

    public function updateStatus(\Illuminate\Http\Request $request, Employee $employee) {
        $this->service->updateStatus($employee, $request->status);
        return back()->with('success', 'Status updated successfully.');
    }

    
}