<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hrm\AttendanceRequest;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Scopes\OrganizationScope;
use App\Services\AttendanceService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function __construct(protected AttendanceService $service) {}

    public function index()
    {
        $orgId = auth()->user()->organization_id;

        $employeesQuery = Employee::withoutGlobalScope(OrganizationScope::class)
            ->with(['user' => function ($query) {
                $query->withoutGlobalScope(OrganizationScope::class);
            }])
            ->where('status', 'active')
            ->when($orgId, function ($q) use ($orgId) {
                $q->where('organization_id', $orgId);
            }, function ($q) {
                $q->whereIn('organization_id', [1, null]);
            })
            ->get(['id', 'employee_code']);

        return Inertia::render('Hrm/Attendances/Index', [
            'attendances' => $this->service->getAll(),
            'employees' => $employeesQuery,
        ]);
    }

    public function store(AttendanceRequest $request)
    {
        $this->service->create($request->validated());
        return back()->with('success', 'Attendance marked successfully.');
    }

    public function update(AttendanceRequest $request, Attendance $attendance)
    {
        $this->service->update($attendance, $request->validated());
        return back()->with('success', 'Attendance updated successfully.');
    }

    public function destroy(Attendance $attendance)
    {
        $this->service->delete($attendance);
        return back()->with('success', 'Attendance record deleted successfully.');
    }

    public function report(Request $request)
    {
        $validated = $request->validate(['month' => 'nullable|date_format:Y-m']);
        $month = $validated['month'] ?? now()->format('Y-m');
        $startDate = "$month-01";
        $endDate = date('Y-m-t', strtotime($startDate));
        $orgId = auth()->user()->organization_id;

        $query = Attendance::withoutGlobalScope(OrganizationScope::class)
            ->with(['employee' => function ($q) {
                $q->withoutGlobalScope(OrganizationScope::class)
                  ->with(['user' => function ($uq) {
                      $uq->withoutGlobalScope(OrganizationScope::class);
                  }]);
            }])
            ->whereBetween('attendance_date', [$startDate, $endDate]);

        if ($orgId) {
            $query->where('organization_id', $orgId);
        } else {
            $query->whereIn('organization_id', [1, null]);
        }

        $records = $query->get();

        $summary = $records->groupBy('employee_id')->map(function ($group) {
            $employee = $group->first()->employee;
            $user = $employee?->user;
            return [
                'employee_id' => $group->first()->employee_id,
                'employee_name' => $user ? "{$user->first_name} {$user->last_name}" : 'N/A',
                'employee_code' => $employee?->employee_code ?? '-',
                'total_days' => $group->count(),
                'present' => $group->where('status', 'present')->count(),
                'absent' => $group->where('status', 'absent')->count(),
                'late' => $group->where('status', 'late')->count(),
                'leave' => $group->where('status', 'leave')->count(),
                'half_day' => $group->where('status', 'half_day')->count(),
                'holiday' => $group->where('status', 'holiday')->count(),
                'total_working_hours' => round($group->sum('working_hours'), 2),
                'total_overtime_minutes' => $group->sum('overtime_minutes'),
            ];
        })->values();

        return Inertia::render('Hrm/Attendances/Report', [
            'summary' => $summary,
            'month' => $month,
        ]);
    }
}