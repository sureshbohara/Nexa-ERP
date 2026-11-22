<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\ExpenseRequest;
use App\Models\Account;
use App\Models\Branch;
use App\Models\Expense;
use App\Services\ExpenseService;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function __construct(protected ExpenseService $service) {}


    public function index(){
        return Inertia::render('Accounting/Expenses/Index', [
            'expenses' => $this->service->getAll(),
            'accounts' => Account::where('status', 'active')->get(['id', 'name', 'code', 'type']),
            'branches' => Branch::where('status', 'active')->get(['id', 'name']),
        ]);
    }

    public function store(ExpenseRequest $request){
        $this->service->create($request->validated());
        return back()->with('success', 'Expense recorded successfully.');
    }


    public function update(ExpenseRequest $request, Expense $expense){
        $this->service->update($expense, $request->validated());
        return back()->with('success', 'Expense updated successfully.');
    }


    public function destroy(Expense $expense){
        $this->service->delete($expense);
        return back()->with('success', 'Expense deleted successfully.');
    }

    public function approve(Expense $expense){
        $this->service->updateStatus($expense, 'approved');
        return back()->with('success', 'Expense approved successfully.');
    }


    public function reject(Expense $expense){
        $this->service->updateStatus($expense, 'rejected');
        return back()->with('success', 'Expense rejected successfully.');
    }
    
}