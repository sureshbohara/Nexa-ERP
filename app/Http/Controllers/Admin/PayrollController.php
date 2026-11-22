<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Hrm\PayrollProcessRequest;
use App\Models\Branch;
use App\Models\Payroll;
use App\Services\PayrollService;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PayrollController extends Controller
{
    public function __construct(protected PayrollService $service) {}

    public function index(): Response
    {
        return Inertia::render('Hrm/Payrolls/Index', [
            'payrolls' => $this->service->getAll(),
            'branches' => Branch::query()->where('status', 'active')->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function process(PayrollProcessRequest $request): RedirectResponse
    {
        $this->service->processPayroll($request->validated());
        return back()->with('success', 'Payroll processed and payslips generated successfully.');
    }

    public function markPaid(Payroll $payroll): RedirectResponse
    {
        $this->service->markPaid($payroll);
        return back()->with('success', 'Payroll and all related payslips marked as paid.');
    }
}