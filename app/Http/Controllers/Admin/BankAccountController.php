<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Accounting\BankAccountRequest;
use App\Models\BankAccount;
use App\Models\Account;
use App\Services\BankAccountService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BankAccountController extends Controller
{
    public function __construct(protected BankAccountService $service) {}

    public function index(){
        return Inertia::render('Accounting/BankAccounts/Index', [
            'bankAccounts' => $this->service->getAll(),
        ]);
    }

    public function store(BankAccountRequest $request){
        $this->service->create($request->validated());
        return back()->with('success', 'Bank account created successfully.');
    }

    public function update(BankAccountRequest $request, BankAccount $bankAccount){
        $this->service->update($bankAccount, $request->validated());
        return back()->with('success', 'Bank account updated successfully.');
    }

    public function destroy(BankAccount $bankAccount){
        $this->service->delete($bankAccount);
        return back()->with('success', 'Bank account deleted successfully.');
    }

    public function updateStatus(Request $request, BankAccount $bankAccount){
        $validated = $request->validate(['status' => ['required', 'in:active,inactive']]);
        $this->service->updateStatus($bankAccount, $validated['status']);
        return back()->with('success', 'Bank account status updated successfully.');
    }
}